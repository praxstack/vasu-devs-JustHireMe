"""Ingestion pipeline hardening: tolerant profile shapes + input caps + zip-bomb guard.

Unit-level (no DB/graph) so these run fast under the suite's global sqlite fake.
"""

from __future__ import annotations

import io
import zipfile

import pytest

from profile.normalization import (
    MAX_SKILLS,
    coerce_skills_shape,
    normalize_profile_payload,
    normalize_skills,
)


def _skill_names(payload: dict) -> list[str]:
    return [s["name"] for s in payload["skills"]]


class TestSkillsShapeTolerance:
    def test_grouped_dict_flattens_to_categorized_skills(self):
        out = normalize_profile_payload({
            "skills": {"languages": ["Python", "TypeScript"], "frontend": ["React"]}
        })
        names = _skill_names(out)
        assert "Python" in names and "React" in names
        # category name must NOT leak in as a skill
        assert "languages" not in [n.lower() for n in names]
        cats = {s["name"]: s["category"] for s in out["skills"]}
        assert cats.get("Python") == "languages"
        assert cats.get("React") == "frontend"

    def test_flat_string_list(self):
        out = normalize_profile_payload({"skills": ["Python", "PostgreSQL"]})
        assert "Python" in _skill_names(out)

    def test_list_of_alt_keyed_dicts(self):
        # skill dicts keyed 'skill'/'title'/'label' instead of 'name'
        out = normalize_skills(coerce_skills_shape([
            {"skill": "Python"}, {"title": "React"}, {"label": "Rust"},
        ]))
        got = {s["name"] for s in out}
        assert {"Python", "React", "Rust"} <= got

    def test_grouped_dict_with_scalar_values(self):
        out = normalize_skills(coerce_skills_shape({"primary": "Python"}))
        assert any(s["name"] == "Python" for s in out)

    def test_grouped_dict_with_nested_dicts(self):
        out = normalize_skills(coerce_skills_shape({"lang": [{"name": "Python"}]}))
        assert any(s["name"] == "Python" and s["category"] == "lang" for s in out)

    @pytest.mark.parametrize("garbage", [None, 42, "just a string", 3.14])
    def test_non_list_non_dict_coerces_empty(self, garbage):
        assert coerce_skills_shape(garbage) == []

    def test_list_stack_project_is_accepted(self):
        out = normalize_profile_payload({"projects": [{"title": "X", "stack": ["Python", "React"]}]})
        assert out["projects"], "a project with a list stack must import"
        assert "Python" in out["projects"][0]["stack"]

    def test_skills_are_capped(self):
        many = [f"Skill{i}" for i in range(MAX_SKILLS + 50)]
        out = normalize_profile_payload({"skills": many})
        assert len(out["skills"]) <= MAX_SKILLS


class TestFieldCaps:
    def test_oversized_summary_truncated_not_rejected(self):
        out = normalize_profile_payload({"candidate": {"name": "A", "summary": "z" * 9000}})
        assert len(out["candidate"]["summary"]) <= 4000

    def test_oversized_experience_description_truncated(self):
        out = normalize_profile_payload({
            "experience": [{"role": "Engineer", "company": "Acme", "description": "d" * 9000}]
        })
        assert out["experience"], "experience should import"
        assert len(out["experience"][0]["description"]) <= 5000


class TestLinkedInZipBomb:
    def _zip_with_member(self, name: str, size: int) -> bytes:
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
            # highly compressible payload -> tiny archive, large decompressed size
            zf.writestr(name, b"A" * size)
        return buf.getvalue()

    def test_oversized_member_rejected(self):
        from profile.linkedin_parser import _MAX_CSV_MEMBER_BYTES, _read_csv

        payload = self._zip_with_member("Skills.csv", _MAX_CSV_MEMBER_BYTES + 1)
        with zipfile.ZipFile(io.BytesIO(payload)) as zf, pytest.raises(ValueError):
            _read_csv(zf, "Skills.csv")

    def test_normal_member_reads_fine(self):
        from profile.linkedin_parser import _read_csv

        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w") as zf:
            zf.writestr("Skills.csv", "Name\nPython\nReact\n")
        with zipfile.ZipFile(io.BytesIO(buf.getvalue())) as zf:
            rows = _read_csv(zf, "Skills.csv")
        assert [r["Name"] for r in rows] == ["Python", "React"]
