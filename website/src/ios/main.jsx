import React from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  ArrowUpRight,
  BatteryFull,
  CellSignalFull,
  CheckCircle,
  GithubLogo,
  Plus,
  WifiHigh,
  XLogo,
} from "@phosphor-icons/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./ios.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The iPhone beta waitlist page. Visual language is lifted from the iOS app
// (ios/JustHireMe/NotebookDesign.swift + Theme.swift): pencil-outline cards,
// crayon strokes, ruled paper, Instrument Serif / Instrument Sans, pastel tints.

const WAITLIST_LIST = "ios";
const REPO_URL = "https://github.com/vasu-devs/JustHireMe";
const X_URL = "https://x.com/vasu_devs";
const CONTACT_EMAIL = "pls@justhireme.ai";

const steps = [
  {
    chapter: "01 / Profile",
    tint: "lavender",
    title: "Start with what you already have",
    body: "Drop in your resume, portfolio, notes or Markdown files. It sorts everything into sections, and you can edit any of them.",
    screen: { src: "/ios/import.webp", alt: "The Add content screen sorting a portfolio file into About, Experience, Education, Projects and Skills" },
  },
  {
    chapter: "02 / For you",
    tint: "mint",
    title: "See the jobs that fit you",
    body: "New roles from every field are checked against your profile. You only see the strong matches, with the skills behind each one.",
    screen: { src: "/ios/matches.webp", alt: "The Job matches screen listing a UX Designer role at 100% skill match and a Product Designer role at 75%" },
  },
  {
    chapter: "03 / Apply",
    tint: "sky",
    title: "Tap Apply now",
    body: "It tailors your resume to the role, fills in the form and emails you once it's sent. If a question needs your answer, it asks you first.",
    screen: { src: "/ios/apply.webp", alt: "A Product Designer role with its skills match and the Apply now button" },
  },
  {
    chapter: "04 / Applications",
    tint: "peach",
    title: "Know where every application stands",
    body: "Submitted, interviewing, offer or rejected. Every application and its history, in one place.",
    screen: { tracker: true, alt: "The Applications screen with a count of applications at each stage" },
  },
  {
    chapter: "05 / Grow",
    tint: "butter",
    title: "Learn what to work on next",
    body: "It looks at the skills your matches keep asking for that your profile doesn't have yet, and suggests what to practise.",
    screen: { src: "/ios/grow.webp", alt: "The What to work on screen suggesting Kubernetes, requested by 3 roles" },
  },
];

const plans = [
  { name: "One application", detail: "Pay once for a single application. No subscription.", tint: "card" },
  { name: "Weekly", detail: "A set number of applications each week. Cancel any time.", tint: "card" },
  { name: "Monthly", detail: "A larger allowance, renewed each month. Cancel any time.", tint: "lavender" },
];

const questions = [
  {
    q: "Is the desktop app still free?",
    a: "Yes. The open source desktop app stays free and keeps running on your own machine. The iPhone app is a separate, paid service for people who want the applying done for them.",
  },
  {
    q: "Will it apply to jobs without asking me?",
    a: "Only if you turn on auto-apply, and only within the roles, location and daily limit you set. You can pause it any time. Questions that need a personal answer come back to you.",
  },
  {
    q: "Which job sites can it apply on?",
    a: "At launch it applies through Greenhouse, Lever and Ashby application forms, with more to follow. Roles it can't apply to are marked, so you can apply yourself.",
  },
  {
    q: "When does the beta open?",
    a: "Soon. Everyone on the waitlist gets one email when it opens. No newsletter.",
  },
  {
    q: "What happens to my email?",
    a: "It's used to invite you to the beta and tell you when the app launches. Nothing else, and it's never sold or shared.",
  },
];

/* ---------- notebook primitives (mirroring NotebookDesign.swift) ---------- */

// Same wobble as PencilOutline in SwiftUI, expressed in a 100x100 box. Very wide
// shapes (the nav bar) need smaller side insets or the corners stretch apart.
const PENCIL_PATHS = {
  card: "M3 1.2 Q50 -0.6 97 1.6 Q100.6 50 99.2 96.4 Q50 100.8 2.4 99 Q-0.8 50 3 1.2 Z",
  wide: "M0.7 4 Q50 -1.5 99.3 3 Q100.3 50 99.5 95 Q50 101.5 0.5 97 Q-0.3 50 0.7 4 Z",
};

function PencilOutline({ shape = "card" }) {
  return (
    <svg className="pencil" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={PENCIL_PATHS[shape]} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function crayonPaths(width) {
  // Seven wavy passes, like CrayonStroke's Canvas loop.
  return Array.from({ length: 7 }, (_, row) => {
    const y = row * 2 + 2;
    let d = `M${(row % 3) * 2} ${y}`;
    for (let x = 0; x <= width; x += 7) {
      d += ` L${x} ${(y + Math.sin((x + row * 9) * 0.08) * 1.5).toFixed(2)}`;
    }
    return d;
  });
}

function CrayonStroke({ tint = "lavender", width = 120, className = "" }) {
  const paths = React.useMemo(() => crayonPaths(width), [width]);
  return (
    <svg
      className={`crayon crayon-${tint} ${className}`}
      viewBox={`0 0 ${width} 18`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {paths.map((d, i) => <path key={i} d={d} pathLength="1" style={{ "--i": i }} />)}
    </svg>
  );
}

function NotebookCard({ tint = "card", ruled = false, className = "", children, ...rest }) {
  return (
    <div className={`nb-card tint-${tint} ${ruled ? "ruled" : ""} ${className}`} {...rest}>
      {children}
      <PencilOutline />
    </div>
  );
}

function Chapter({ label, tint }) {
  return (
    <span className="chapter">
      {label}
      <CrayonStroke tint={tint} width={42} className="chapter-stroke" />
    </span>
  );
}

/* ---------- phone ---------- */

function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <span>9:41</span>
      <span className="status-icons">
        <CellSignalFull weight="fill" />
        <WifiHigh weight="bold" />
        <BatteryFull weight="fill" />
      </span>
    </div>
  );
}

function TrackerScreen() {
  // A static rendering of the Applications tab (ApplicationTrackerView) with sample data.
  const rows = [
    { label: "Submitted", count: 14, tint: "sky" },
    { label: "Interviewing", count: 3, tint: "mint" },
    { label: "Offer", count: 1, tint: "butter" },
    { label: "Rejected", count: 5, tint: "peach" },
  ];
  const max = Math.max(...rows.map((row) => row.count));
  return (
    <div className="app-screen">
      <div className="app-nav">Applications</div>
      <div className="app-body">
        <Chapter label="03 / Tracker" tint="peach" />
        <h4 className="app-title">Your applications</h4>
        <p className="app-sub">Track responses, interviews and offers.</p>
        <NotebookCard ruled className="app-chart">
          <strong className="app-total">23 <span>applications</span></strong>
          {rows.map((row) => (
            <div className="app-bar-row" key={row.label}>
              <span>{row.label}</span>
              <i className={`app-bar tint-${row.tint}`} style={{ width: `${(row.count / max) * 100}%` }} />
              <b>{row.count}</b>
            </div>
          ))}
        </NotebookCard>
        {[
          { status: "Interviewing", role: "Product Designer", company: "Northstar", tint: "mint" },
          { status: "Submitted", role: "UX Designer", company: "Moss", tint: "sky" },
          { status: "Rejected", role: "Design Engineer", company: "Fieldnote", tint: "peach" },
        ].map((item) => (
          <NotebookCard key={item.role} tint={item.tint} className="app-item">
            <span className="app-item-status">{item.status}</span>
            <strong>{item.role}</strong>
            <span className="app-item-meta">{item.company}</span>
          </NotebookCard>
        ))}
      </div>
      <div className="app-tabs" aria-hidden="true">
        {["Profile", "For You", "Applications", "Grow", "Plan"].map((tab) => (
          <span key={tab} className={tab === "Applications" ? "active" : ""}>{tab}</span>
        ))}
      </div>
    </div>
  );
}

function ScreenContent({ screen, eager = false }) {
  return screen.tracker ? (
    <div className="screen-fill" role="img" aria-label={screen.alt}><TrackerScreen /></div>
  ) : (
    <img src={screen.src} alt={screen.alt} width="603" height="1170" loading={eager ? "eager" : "lazy"} decoding="async" />
  );
}

function PhoneFrame({ className = "", children }) {
  return (
    <figure className={`phone ${className}`}>
      <div className="phone-glass">
        <StatusBar />
        <div className="phone-screen">{children}</div>
      </div>
    </figure>
  );
}

function Phone({ screen, className = "", eager = false }) {
  return (
    <PhoneFrame className={className}>
      <ScreenContent screen={screen} eager={eager} />
    </PhoneFrame>
  );
}

/* ---------- waitlist ---------- */

function signupSource() {
  try {
    const params = new URLSearchParams(window.location.search);
    const tagged = params.get("ref") || params.get("utm_source");
    if (tagged) return tagged;
    const host = document.referrer ? new URL(document.referrer).hostname : "";
    if (/(^|\.)(t\.co|x\.com|twitter\.com)$/.test(host)) return "x";
    if (host.endsWith("linkedin.com")) return "linkedin";
    if (host && host !== window.location.hostname) return host.replace(/^www\./, "");
  } catch {
    // An unreadable referrer just means we don't know the source.
  }
  return "direct";
}

const WaitlistContext = React.createContext(null);

function WaitlistProvider({ children }) {
  const [count, setCount] = React.useState(null);
  const [joined, setJoined] = React.useState(null); // null | "new" | "already"

  React.useEffect(() => {
    let cancelled = false;
    fetch(`/api/waitlist?list=${WAITLIST_LIST}`)
      .then((response) => response.json())
      .then((payload) => {
        if (!cancelled && typeof payload.count === "number") setCount(payload.count);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const join = React.useCallback(async (email, website) => {
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, website, list: WAITLIST_LIST, source: signupSource() }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "Couldn't save your email. Try again in a minute.");
    if (payload.configured === false) throw new Error("Sign-ups aren't switched on yet. Try again soon.");
    if (typeof payload.count === "number") setCount(payload.count);
    setJoined(payload.already ? "already" : "new");
  }, []);

  const value = React.useMemo(() => ({ count, joined, join }), [count, joined, join]);
  return <WaitlistContext.Provider value={value}>{children}</WaitlistContext.Provider>;
}

// Live number of people on the iPhone waitlist (read from Supabase via /api/waitlist).
// Counts up when it first loads and ticks up again the moment someone joins.
function WaitlistCounter({ className = "" }) {
  const { count } = React.useContext(WaitlistContext);
  const [display, setDisplay] = React.useState(0);
  const shown = React.useRef({ value: 0 });

  React.useEffect(() => {
    if (count == null) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shown.current.value = count;
      setDisplay(count);
      return undefined;
    }
    const tween = gsap.to(shown.current, {
      value: count,
      duration: Math.min(1.4, 0.5 + Math.abs(count - shown.current.value) * 0.02),
      ease: "power2.out",
      onUpdate: () => setDisplay(Math.round(shown.current.value)),
    });
    return () => tween.kill();
  }, [count]);

  if (count == null) return <div className={`waitlist-counter is-loading ${className}`} aria-hidden="true" />;
  return (
    <div className={`waitlist-counter ${className}`} aria-live="polite">
      {count === 0 ? (
        <span className="counter-label">Be the first on the waitlist</span>
      ) : (
        <>
          <strong className="counter-num" aria-label={count.toLocaleString()}>
            {display.toLocaleString()}
            <CrayonStroke tint="lavender" width={90} className="counter-stroke" />
          </strong>
          <span className="counter-label">{count === 1 ? "person on the waitlist" : "people on the waitlist"}</span>
        </>
      )}
    </div>
  );
}

function WaitlistForm({ id, size = "large" }) {
  const { joined, join } = React.useContext(WaitlistContext);
  const [email, setEmail] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const inputId = `${id}-email`;
  const errorId = `${id}-error`;

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Enter a valid email address, like you@example.com.");
      return;
    }
    setSubmitting(true);
    try {
      await join(email.trim(), website);
    } catch (caught) {
      setError(caught.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (joined) {
    return (
      <div className={`waitlist-done ${size}`} role="status">
        <CheckCircle weight="fill" aria-hidden="true" />
        <div>
          <strong>{joined === "already" ? "You're already on the list." : "You're on the list."}</strong>
          <span>We'll email you once when the beta opens.</span>
        </div>
      </div>
    );
  }

  return (
    <form className={`waitlist-form ${size}`} onSubmit={submit} noValidate>
      <label htmlFor={inputId}>Email</label>
      <div className="waitlist-row">
        <input
          id={inputId}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          required
        />
        <button type="submit" className="nb-button" disabled={submitting}>
          <span>{submitting ? "Joining" : "Join the beta"}</span>
          <ArrowRight weight="bold" aria-hidden="true" />
        </button>
      </div>
      <input
        className="honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        name="website"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
      />
      {error ? (
        <p className="form-error" id={errorId} role="alert">{error}</p>
      ) : (
        <p className="form-note">One email when it opens. No newsletter.</p>
      )}
    </form>
  );
}

/* ---------- sections ---------- */

const navLinks = [
  { id: "how", label: "How it works", tint: "lavender" },
  { id: "auto", label: "Auto-apply", tint: "butter" },
  { id: "plans", label: "Pricing", tint: "mint" },
  { id: "faq", label: "FAQ", tint: "peach" },
];

function Header() {
  const [active, setActive] = React.useState(null);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    // Lift the bar once the page top leaves the viewport (no scroll listeners).
    const top = document.getElementById("top");
    const lift = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    if (top) lift.observe(top);

    // Underline the link for the section currently in the middle of the screen.
    const sections = navLinks.map((link) => document.getElementById(link.id)).filter(Boolean);
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
          else setActive((current) => (current === entry.target.id ? null : current));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => spy.observe(section));
    return () => { lift.disconnect(); spy.disconnect(); };
  }, []);

  return (
    <div className="nav-wrap">
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="JustHireMe for iPhone, back to top">
          <img src="/ios/icon-64.png" alt="" width="34" height="34" />
          <span className="brand-name">JustHireMe</span>
          <span className="brand-tag">iPhone beta</span>
        </a>
        <nav className="header-nav" aria-label="Sections">
          {navLinks.map((link) => (
            <a key={link.id} href={`#${link.id}`} aria-current={active === link.id ? "location" : undefined}>
              {link.label}
              <CrayonStroke tint={link.tint} width={64} className="nav-stroke" />
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-quiet" href="/">Desktop app <ArrowUpRight weight="bold" aria-hidden="true" /></a>
          <a className="nb-button header-cta" href="#join">
            <span>Join the beta</span>
            <ArrowRight weight="bold" aria-hidden="true" />
          </a>
        </div>
        <PencilOutline shape="wide" />
      </header>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <NotebookCard ruled className="hero-sheet">
        <div className="hero-copy">
          <Chapter label="iPhone beta" tint="lavender" />
          <h1 id="hero-title">
            Your job hunt, <em className="underlined">handled.<CrayonStroke tint="lavender" width={160} className="headline-stroke" /></em>
          </h1>
          <p className="hero-sub">
            Upload your resume once. JustHireMe finds roles that fit, tailors your resume and applies for you.
          </p>
          <WaitlistForm id="hero" />
          <WaitlistCounter />
        </div>
      </NotebookCard>
      <div className="hero-phone">
        <Phone screen={steps[1].screen} eager />
      </div>
    </section>
  );
}

function HowItWorks() {
  const [active, setActive] = React.useState(0);
  const sectionRef = React.useRef(null);
  const stepRefs = React.useRef([]);

  // Which step is in the middle of the screen: drives the card highlight, the
  // "Sample data" note, and the screen swap when scrubbing is off (mobile, reduced motion).
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  // Desktop: one phone whose screens change like an iOS navigation push, driven by
  // the scroll position. Each step owns one unit of the timeline; around each
  // boundary the next screen slides in from the right over the current one, which
  // eases a little to the left underneath. Transforms only, so it stays on the GPU.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const stack = sectionRef.current.querySelector(".screen-stack");
      const screens = gsap.utils.toArray(".screen-stack .screen", sectionRef.current);
      stack.classList.add("is-scrubbed");
      gsap.set(screens, { autoAlpha: 1, xPercent: 100 });
      gsap.set(screens[0], { xPercent: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: 0.5 },
        scrollTrigger: {
          trigger: sectionRef.current.querySelector(".how-steps"),
          start: "top center",
          end: "bottom center",
          scrub: 0.6,
        },
      });
      screens.forEach((screen, index) => {
        if (index === 0) return;
        const at = index - 0.25;
        timeline
          .to(screen, { xPercent: 0 }, at)
          .to(screens[index - 1], { xPercent: -28 }, at)
          .to(screens[index - 1].querySelector(".screen-shade"), { opacity: 1 }, at);
      });
      timeline.set({}, {}, screens.length); // keep one timeline unit per step

      return () => stack.classList.remove("is-scrubbed");
    });
  }, { scope: sectionRef });

  return (
    <section className="how" id="how" aria-labelledby="how-title" ref={sectionRef}>
      <h2 id="how-title" className="section-title">From a resume to applications, in five screens.</h2>
      <div className="how-grid">
        <div className="how-phone" aria-hidden="true">
          <div className="phone-sticky">
            <PhoneFrame>
              <div className="screen-stack">
                {steps.map((step, index) => (
                  <div key={step.chapter} className={`screen ${index === active ? "is-active" : ""}`}>
                    <ScreenContent screen={step.screen} eager={index < 2} />
                    <span className="screen-shade" />
                  </div>
                ))}
              </div>
            </PhoneFrame>
            <p className="sample-note stack-note" data-visible={steps[active].screen.tracker ? "true" : "false"}>Sample data</p>
          </div>
        </div>
        <ol className="how-steps">
          {steps.map((step, index) => (
            <li
              key={step.chapter}
              data-index={index}
              ref={(node) => { stepRefs.current[index] = node; }}
              className={`how-step ${index === active ? "is-active" : ""}`}
            >
              <NotebookCard tint={step.tint}>
                <Chapter label={step.chapter} tint={step.tint} />
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </NotebookCard>
              <Phone screen={step.screen} className="inline-phone" />
              {step.screen.tracker && <p className="sample-note">Sample data</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function AutoApply() {
  const rules = [
    ["Roles", "Product Designer, UX Designer"],
    ["Location", "Remote"],
    ["Minimum skill overlap", "75%"],
    ["Daily limit", "Up to 2 a day"],
  ];
  return (
    <section className="auto" id="auto" aria-labelledby="auto-title">
      <div className="auto-copy">
        <h2 id="auto-title" className="section-title">Or let it apply while you get on with your day.</h2>
        <p>
          Turn on auto-apply and set the rules: which roles, where, how close a match, and how many a day.
          It stays inside them, skips duplicates and never goes over your allowance. Pause it any time.
        </p>
      </div>
      <NotebookCard tint="butter" className="auto-card">
        <div className="auto-card-head">
          <strong>Auto-apply</strong>
          <span className="toggle" role="img" aria-label="Switched on"><i /></span>
        </div>
        <dl>
          {rules.map(([term, value]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="auto-card-foot">Only these roles and this location qualify. Turn it off at any time.</p>
      </NotebookCard>
    </section>
  );
}

function Plans() {
  return (
    <section className="plans" id="plans" aria-labelledby="plans-title">
      <div className="plans-copy">
        <h2 id="plans-title" className="section-title">Pay for applications, not features.</h2>
        <p>
          Every plan includes the full app. You only choose how many applications you want.
          One-tap and auto-apply share the same allowance.
        </p>
        <p className="plans-note">Prices will be announced when the beta opens.</p>
      </div>
      <ul className="plan-list">
        {plans.map((plan) => (
          <li key={plan.name}>
            <NotebookCard tint={plan.tint} className="plan">
              <div>
                <strong>{plan.name}</strong>
                <span>{plan.detail}</span>
              </div>
            </NotebookCard>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Questions() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <NotebookCard ruled className="faq-sheet">
        <h2 id="faq-title" className="section-title">Questions</h2>
        {questions.map((item) => (
          <details key={item.q}>
            <summary>
              <span>{item.q}</span>
              <Plus weight="bold" aria-hidden="true" />
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </NotebookCard>
    </section>
  );
}

function FinalCall() {
  return (
    <section className="final" id="join" aria-labelledby="final-title">
      <NotebookCard tint="lavender" className="final-card">
        <h2 id="final-title">Be one of the first to use it.</h2>
        <p>Leave your email and we'll send your invite when the beta opens.</p>
        <WaitlistForm id="final" size="compact" />
        <WaitlistCounter className="is-compact" />
      </NotebookCard>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <span>JustHireMe</span>
      <nav aria-label="Footer">
        <a href="/">Desktop app</a>
        <a href={REPO_URL}><GithubLogo aria-hidden="true" /> GitHub</a>
        <a href={X_URL}><XLogo aria-hidden="true" /> @vasu_devs</a>
        <a href="/legal/privacy-policy.html">Privacy</a>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL} <ArrowUpRight aria-hidden="true" /></a>
      </nav>
    </footer>
  );
}

// Smooth, inertial wheel scrolling (touch keeps native scrolling). Lenis runs on
// GSAP's ticker so ScrollTrigger reads the same scroll position every frame.
const NAV_CLEARANCE = 100; // floating nav height + breathing room; matches scroll-padding-top

function useSmoothScroll() {
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // In-page links: glide to an exact pixel target that clears the floating nav.
    const onClick = (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey) return;
      const id = link.getAttribute("href").slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      const y = id === "top" ? 0 : target.getBoundingClientRect().top + window.scrollY - NAV_CLEARANCE;
      lenis.scrollTo(Math.max(0, y), { duration: 1.1 });
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}

function App() {
  useSmoothScroll();
  return (
    <WaitlistProvider>
      <span id="top" className="top-sentinel" aria-hidden="true" />
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <AutoApply />
        <Plans />
        <Questions />
        <FinalCall />
      </main>
      <Footer />
    </WaitlistProvider>
  );
}

createRoot(document.getElementById("root")).render(<App />);
