import React, { useState, useMemo, useEffect } from "react";
import {
  Flame,
  Dumbbell,
  Sparkles,
  Lock,
  Check,
  ChevronRight,
  ChevronLeft,
  Home,
  Building2,
  Weight,
  Timer,
  Utensils,
  Camera,
  ShieldCheck,
  Star,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const QUESTIONS = [
  {
    id: "goal",
    title: "What brings you to Gurukul?",
    sub: "Your guru shapes every session around this.",
    options: [
      { v: "muscle", label: "Build muscle", icon: Dumbbell },
      { v: "lose", label: "Lose fat", icon: Flame },
      { v: "tone", label: "Get lean & toned", icon: Sparkles },
      { v: "stamina", label: "Build stamina", icon: Timer },
    ],
  },
  {
    id: "level",
    title: "Where does your practice stand today?",
    sub: "Be honest — the path adjusts either way.",
    options: [
      { v: "beginner", label: "Just starting out" },
      { v: "intermediate", label: "Train on and off" },
      { v: "advanced", label: "Train consistently" },
    ],
  },
  {
    id: "equipment",
    title: "Where will you train?",
    sub: "The guru adapts the room, not the other way round.",
    options: [
      { v: "none", label: "Home, no equipment", icon: Home },
      { v: "basic", label: "Home, basic gear", icon: Weight },
      { v: "gym", label: "Full gym access", icon: Building2 },
    ],
  },
  {
    id: "days",
    title: "How many days a week, honestly?",
    sub: "Consistency beats intensity, every time.",
    options: [
      { v: "3", label: "3 days" },
      { v: "5", label: "4–5 days" },
      { v: "6", label: "6+ days" },
    ],
  },
  {
    id: "focus",
    title: "Any area you want extra attention on?",
    sub: "The guru weights your split around this.",
    options: [
      { v: "full", label: "Full body" },
      { v: "upper", label: "Upper body" },
      { v: "core", label: "Core & posture" },
      { v: "legs", label: "Legs & glutes" },
    ],
  },
];

const GOAL_COPY = {
  muscle: { title: "Hypertrophy Path", cals: "+300 kcal surplus", focus: "Progressive overload, 8–12 rep ranges" },
  lose: { title: "Fat Loss Path", cals: "-400 kcal deficit", focus: "Metabolic circuits + strength retention" },
  tone: { title: "Lean & Toned Path", cals: "Maintenance ± 100 kcal", focus: "Moderate volume, higher frequency" },
  stamina: { title: "Endurance Path", cals: "Maintenance calories", focus: "Conditioning blocks + tempo work" },
};

const LEVEL_LABEL = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
const EQUIP_LABEL = { none: "Bodyweight", basic: "Home gear", gym: "Full gym" };

function generatePlan(a) {
  const goal = GOAL_COPY[a.goal] || GOAL_COPY.muscle;
  const days = parseInt(a.days, 10) || 4;
  return {
    programTitle: goal.title,
    level: LEVEL_LABEL[a.level] || "Beginner",
    equipment: EQUIP_LABEL[a.equipment] || "Bodyweight",
    days,
    duration: 8,
    calories: goal.cals,
    focusNote: goal.focus,
    split: buildSplit(days, a.focus),
  };
}

function buildSplit(days, focus) {
  const base = ["Full Body Strength", "Active Recovery", "Push Focus", "Pull Focus", "Legs & Core", "Conditioning", "Rest & Mobility"];
  if (focus === "upper") base[2] = "Upper Body Emphasis";
  if (focus === "core") base[1] = "Core & Posture";
  if (focus === "legs") base[4] = "Legs & Glutes Emphasis";
  return base.slice(0, Math.min(days + 1, 7));
}

/* ------------------------------------------------------------------ */
/*  SIGNATURE VISUAL — the Guru Ring                                   */
/* ------------------------------------------------------------------ */

function GuruRing({ size = 120, progress = 0, children }) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(212,175,55,0.16)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--gold)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

function AmbientMandala({ opacity = 0.5 }) {
  return (
    <svg
      viewBox="0 0 600 600"
      className="gk-mandala"
      style={{ position: "absolute", top: "50%", left: "50%", width: 700, height: 700, transform: "translate(-50%,-50%)", opacity, pointerEvents: "none" }}
    >
      {[280, 220, 160, 100].map((r, i) => (
        <circle key={r} cx="300" cy="300" r={r} fill="none" stroke="rgba(212,175,55,0.35)" strokeWidth={i === 0 ? 1.4 : 0.7} />
      ))}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const x1 = 300 + Math.cos(angle) * 100;
        const y1 = 300 + Math.sin(angle) * 100;
        const x2 = 300 + Math.cos(angle) * 280;
        const y2 = 300 + Math.sin(angle) * 280;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(212,175,55,0.08)" strokeWidth="1" />;
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  SCREENS                                                             */
/* ------------------------------------------------------------------ */

function Landing({ onStart }) {
  return (
    <div className="gk-screen" style={{ overflow: "hidden", position: "relative" }}>
      <AmbientMandala opacity={0.55} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto", padding: "88px 24px 64px", textAlign: "center" }}>
        <div className="gk-eyebrow">GURUKUL · GYM</div>
        <h1 className="gk-h1">
          Ancient wisdom.
          <br />
          <span style={{ color: "var(--gold)" }}>Modern guidance.</span>
        </h1>
        <p className="gk-body-lg" style={{ marginTop: 18, color: "var(--text-muted)" }}>
          Answer five questions. Your guru builds a training path around your body,
          your goals and your week — not the other way round.
        </p>
        <button className="gk-btn-primary" style={{ marginTop: 36 }} onClick={onStart}>
          Begin Your Path <ChevronRight size={18} />
        </button>
        <div className="gk-trust-row">
          <span><Star size={14} /> 4.7 average rating</span>
          <span><ShieldCheck size={14} /> Cancel anytime</span>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto", padding: "0 24px 96px" }}>
        <div className="gk-grid-3">
          {[
            { icon: Dumbbell, title: "Built around your body", body: "Level, equipment and schedule shape every rep, not a generic template." },
            { icon: Utensils, title: "Food, not restriction", body: "A flexible meal path tuned to your goal — nothing off-limits by default." },
            { icon: Camera, title: "See the change", body: "Photo milestones and streaks make progress visible, week over week." },
          ].map((f, i) => (
            <div key={i} className="gk-card gk-feature-card">
              <f.icon size={22} color="var(--gold)" />
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Quiz({ step, setStep, answers, setAnswers, onDone }) {
  const q = QUESTIONS[step];
  const progress = ((step) / QUESTIONS.length) * 100;

  const choose = (value) => {
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 220);
    } else {
      setTimeout(() => onDone(next), 220);
    }
  };

  return (
    <div className="gk-screen" style={{ padding: "48px 24px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <GuruRing size={52} progress={progress}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--gold)" }}>
              {step + 1}/{QUESTIONS.length}
            </span>
          </GuruRing>
          {step > 0 && (
            <button className="gk-link-back" onClick={() => setStep(step - 1)}>
              <ChevronLeft size={16} /> Back
            </button>
          )}
        </div>

        <div key={q.id} className="gk-fade-in">
          <h2 className="gk-h2">{q.title}</h2>
          <p className="gk-body" style={{ color: "var(--text-muted)", marginTop: 8, marginBottom: 32 }}>{q.sub}</p>

          <div className="gk-option-list">
            {q.options.map((o) => {
              const Icon = o.icon;
              const active = answers[q.id] === o.v;
              return (
                <button key={o.v} className={`gk-option${active ? " gk-option-active" : ""}`} onClick={() => choose(o.v)}>
                  {Icon && <Icon size={18} />}
                  <span>{o.label}</span>
                  <ChevronRight size={16} style={{ marginLeft: "auto", opacity: 0.5 }} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Generating({ onComplete }) {
  const [msg, setMsg] = useState(0);
  const msgs = ["Reading your answers…", "Consulting your guru…", "Shaping your path…"];
  useEffect(() => {
    const t = setInterval(() => setMsg((m) => (m + 1) % msgs.length), 800);
    const done = setTimeout(() => onComplete && onComplete(), 2000);
    return () => {
      clearInterval(t);
      clearTimeout(done);
    };
  }, [onComplete]);
  return (
    <div className="gk-screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 480 }}>
      <div className="gk-spin-ring">
        <GuruRing size={96} progress={70}>
          <Sparkles size={26} color="var(--gold)" />
        </GuruRing>
      </div>
      <p className="gk-body" style={{ marginTop: 28, color: "var(--text-muted)" }}>{msgs[msg]}</p>
    </div>
  );
}

function PlanPreview({ plan, onUnlock }) {
  return (
    <div className="gk-screen" style={{ padding: "48px 20px 96px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div className="gk-eyebrow" style={{ textAlign: "center" }}>YOUR PATH IS READY</div>
        <h2 className="gk-h2" style={{ textAlign: "center", marginTop: 8 }}>{plan.programTitle}</h2>
        <p className="gk-body" style={{ textAlign: "center", color: "var(--text-muted)", marginTop: 8 }}>
          {plan.level} · {plan.equipment} · {plan.days} days / week · {plan.duration}-week arc
        </p>

        <div className="gk-card" style={{ marginTop: 32 }}>
          <h3 style={{ marginBottom: 14 }}>This week's rhythm</h3>
          {plan.split.map((day, i) => (
            <div key={i} className={`gk-plan-row${i > 1 ? " gk-locked-row" : ""}`}>
              <span className="gk-day-num">{String(i + 1).padStart(2, "0")}</span>
              <span>{i > 1 ? "•••• •••• ••••" : day}</span>
              {i > 1 && <Lock size={14} style={{ marginLeft: "auto", opacity: 0.6 }} />}
            </div>
          ))}
        </div>

        <div className="gk-card" style={{ marginTop: 16, position: "relative", overflow: "hidden" }}>
          <h3 style={{ marginBottom: 10 }}>Nutrition path</h3>
          <p className="gk-body" style={{ color: "var(--text-muted)" }}>{plan.calories} · flexible meals, nothing off-limits</p>
          <div className="gk-blur-overlay">
            <Lock size={20} color="var(--gold)" />
            <span>Full meal plan unlocks below</span>
          </div>
        </div>

        <button className="gk-btn-primary" style={{ width: "100%", marginTop: 28 }} onClick={onUnlock}>
          Unlock My Full Path <ChevronRight size={18} />
        </button>
        <p className="gk-fine-print">No commitment to view pricing.</p>
      </div>
    </div>
  );
}

function Paywall({ onSelect }) {
  const [sel, setSel] = useState("quarterly");
  const plans = [
    { id: "monthly", label: "Monthly", price: "$29.99", per: "/mo", note: "" },
    { id: "quarterly", label: "3 Months", price: "$19.99", per: "/mo", note: "Most chosen · billed $59.99" },
    { id: "yearly", label: "12 Months", price: "$9.99", per: "/mo", note: "Best value · billed $119.99" },
  ];
  return (
    <div className="gk-screen" style={{ padding: "48px 20px 96px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div className="gk-eyebrow" style={{ textAlign: "center" }}>LAST STEP</div>
        <h2 className="gk-h2" style={{ textAlign: "center", marginTop: 8 }}>Choose your path</h2>
        <p className="gk-body" style={{ textAlign: "center", color: "var(--text-muted)", marginTop: 8 }}>
          Every plan includes your full program, meal path and progress tracking.
        </p>

        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
          {plans.map((p) => (
            <button key={p.id} className={`gk-pricing-row${sel === p.id ? " gk-pricing-row-active" : ""}`} onClick={() => setSel(p.id)}>
              <div className={`gk-radio${sel === p.id ? " gk-radio-active" : ""}`} />
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontWeight: 600 }}>{p.label}</div>
                {p.note && <div style={{ fontSize: 12, color: "var(--gold)", marginTop: 2 }}>{p.note}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700 }}>{p.price}<span style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.per}</span></div>
              </div>
            </button>
          ))}
        </div>

        <button className="gk-btn-primary" style={{ width: "100%", marginTop: 28 }} onClick={() => onSelect(sel)}>
          Start My Journey
        </button>
        <div className="gk-trust-row" style={{ justifyContent: "center", marginTop: 16 }}>
          <span><ShieldCheck size={14} /> Cancel anytime</span>
          <span><Lock size={14} /> Secure checkout</span>
        </div>
      </div>
    </div>
  );
}

function Success({ plan }) {
  return (
    <div className="gk-screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 480, textAlign: "center", padding: 24 }}>
      <GuruRing size={88} progress={100}>
        <Check size={28} color="var(--gold)" />
      </GuruRing>
      <h2 className="gk-h2" style={{ marginTop: 24 }}>Welcome to the path.</h2>
      <p className="gk-body" style={{ color: "var(--text-muted)", marginTop: 8, maxWidth: 380 }}>
        Your {plan?.programTitle?.toLowerCase() || "training path"} is saved to your account. Day one is ready when you are.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ROOT                                                                */
/* ------------------------------------------------------------------ */

export default function GurukulFunnel() {
  const [screen, setScreen] = useState("landing");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const plan = useMemo(() => (Object.keys(answers).length ? generatePlan(answers) : null), [answers]);

  return (
    <div className="gk-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');

        .gk-root {
          --bg: #12121d;
          --bg-card: #1b2140;
          --bg-card-alt: #212a4d;
          --gold: #D4AF37;
          --gold-bright: #e8c766;
          --text: #f3efe6;
          --text-muted: #9497ab;
          --border: rgba(212,175,55,0.16);
          --font-display: 'Fraunces', serif;
          --font-body: 'Inter', sans-serif;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-body);
          min-height: 100%;
          width: 100%;
        }
        .gk-screen { position: relative; }
        .gk-eyebrow {
          font-family: var(--font-body);
          font-size: 12px;
          letter-spacing: 0.16em;
          color: var(--gold);
          font-weight: 600;
        }
        .gk-h1 {
          font-family: var(--font-display);
          font-size: 44px;
          line-height: 1.08;
          font-weight: 600;
          margin-top: 14px;
        }
        .gk-h2 {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 600;
          line-height: 1.2;
        }
        .gk-body { font-size: 15px; line-height: 1.6; }
        .gk-body-lg { font-size: 17px; line-height: 1.6; }

        .gk-btn-primary {
          background: linear-gradient(135deg, var(--gold-bright), var(--gold));
          color: #1a1608;
          border: none;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 15px;
          padding: 15px 28px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 8px 24px rgba(212,175,55,0.22);
        }
        .gk-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(212,175,55,0.32); }
        .gk-btn-primary:focus-visible { outline: 2px solid var(--gold-bright); outline-offset: 3px; }

        .gk-trust-row {
          display: flex; gap: 20px; justify-content: center;
          margin-top: 22px; font-size: 12px; color: var(--text-muted);
        }
        .gk-trust-row span { display: inline-flex; align-items: center; gap: 5px; }

        .gk-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 720px) { .gk-grid-3 { grid-template-columns: 1fr; } .gk-h1 { font-size: 34px; } }

        .gk-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
        }
        .gk-feature-card h3 { font-family: var(--font-display); font-size: 17px; margin: 10px 0 6px; }
        .gk-feature-card p { font-size: 13.5px; color: var(--text-muted); line-height: 1.5; }

        .gk-link-back {
          background: none; border: none; color: var(--text-muted);
          display: inline-flex; align-items: center; gap: 2px;
          font-size: 13px; cursor: pointer;
        }
        .gk-link-back:hover { color: var(--text); }

        .gk-option-list { display: flex; flex-direction: column; gap: 10px; }
        .gk-option {
          display: flex; align-items: center; gap: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text);
          padding: 16px 18px;
          border-radius: 14px;
          font-family: var(--font-body);
          font-size: 15px;
          text-align: left;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .gk-option:hover { border-color: rgba(212,175,55,0.45); }
        .gk-option-active { background: var(--bg-card-alt); border-color: var(--gold); }

        .gk-fade-in { animation: gkFadeIn 0.35s ease; }
        @keyframes gkFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

        .gk-plan-row {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06);
          font-size: 14px;
        }
        .gk-plan-row:last-child { border-bottom: none; }
        .gk-day-num { font-family: var(--font-display); color: var(--gold); font-size: 13px; width: 22px; }
        .gk-locked-row { color: var(--text-muted); letter-spacing: 0.05em; }

        .gk-blur-overlay {
          position: absolute; inset: 0;
          background: rgba(18,18,29,0.72);
          backdrop-filter: blur(3px);
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 13px; color: var(--text-muted);
          border-radius: 16px;
        }

        .gk-fine-print { text-align: center; font-size: 12px; color: var(--text-muted); margin-top: 12px; }

        .gk-pricing-row {
          display: flex; align-items: center; gap: 14px;
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 14px; padding: 16px 18px; cursor: pointer;
          color: var(--text);
        }
        .gk-pricing-row-active { border-color: var(--gold); background: var(--bg-card-alt); }
        .gk-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--text-muted); flex-shrink: 0; }
        .gk-radio-active { border-color: var(--gold); background: radial-gradient(circle, var(--gold) 40%, transparent 42%); }

        .gk-spin-ring { animation: gkSpin 3.2s linear infinite; }
        @keyframes gkSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (prefers-reduced-motion: reduce) {
          .gk-fade-in, .gk-spin-ring { animation: none !important; }
        }
      `}</style>

      {screen === "landing" && <Landing onStart={() => setScreen("quiz")} />}
      {screen === "quiz" && (
        <Quiz
          step={step}
          setStep={setStep}
          answers={answers}
          setAnswers={setAnswers}
          onDone={() => setScreen("generating")}
        />
      )}
      {screen === "generating" && <Generating onComplete={() => setScreen("preview")} />}
      {screen === "preview" && plan && <PlanPreview plan={plan} onUnlock={() => setScreen("paywall")} />}
      {screen === "paywall" && <Paywall onSelect={() => setScreen("success")} />}
      {screen === "success" && <Success plan={plan} />}
    </div>
  );
}
