import { useState, useCallback, useRef, useEffect } from "react";
import Onboarding from "./Onboarding.jsx";

// Easter egg: personal profile data (activated by rapid-clicking the icon 10 times)
const PERSONAL_VALUES = {
  eye_contact: 3, social_reciprocity: 3, greetings: 2, social_cues: 2,
  turn_taking: 4, topic_maintenance: 5, perspective_taking: 4,
  prosody: 4, precision_language: 5, figurative: 4,
  deep_focus: 5, topic_intensity: 5, novelty_seeking: 4, system_fascination: 5,
  detail_orientation: 5, pattern_recognition: 5, systematic_thinking: 5, mental_models: 5,
  routine_preference: 3, transition_ease: 4, tolerance_ambiguity: 3, need_closure: 4,
  noise_sensitivity: 4, visual_sensitivity: 3, tactile_sensitivity: 3, sensory_seeking: 3,
  frustration_threshold: 4, recovery_speed: 3, productive_channeling: 5, emotional_expression: 3,
  repetitive_motor: 3, fidgeting: 4, coordination: 3,
  optimization_drive: 5, task_switching: 4, planning: 5, efficiency_intolerance: 5,
};

const FACTORS = [
  {
    name: "Social Communication",
    color: "#4ECDC4", alpha: 0.88, domain: "SCI",
    description: "How you navigate the basics of social interaction — initiating contact, reading the room, and the unwritten rules of human connection.",
    traits: [
      { id: "eye_contact", label: "Eye Contact Comfort", value: 3, tip: "Ease with maintaining or seeking eye contact during conversation. 1 = strongly avoid, 5 = very comfortable / neurotypical range." },
      { id: "social_reciprocity", label: "Social Reciprocity", value: 3, tip: "Natural back-and-forth in social exchanges — responding to others' bids for connection, sharing reactions, emotional ping-pong." },
      { id: "greetings", label: "Greetings & Small Talk", value: 3, tip: "Comfort with ritualistic social exchanges: hellos, goodbyes, weather chat, 'how was your weekend.' 1 = skip entirely, 5 = fluent." },
      { id: "social_cues", label: "Reading Social Cues", value: 3, tip: "Picking up on unspoken signals — body language, tone shifts, when someone wants to leave a conversation, sarcasm detection." },
    ],
  },
  {
    name: "Conversational Skills",
    color: "#45B7AA", alpha: 0.90, domain: "SCI",
    description: "The mechanics of dialogue — staying on track, knowing when to listen vs. speak, and modeling other people's mental states.",
    traits: [
      { id: "turn_taking", label: "Turn-Taking", value: 3, tip: "Natural rhythm of conversation — knowing when to speak, when to pause, not talking over people or going silent too long." },
      { id: "topic_maintenance", label: "Staying On Topic", value: 3, tip: "Ability to stick with a conversational thread vs. veering into tangents. High scores can also mean you pull others back on track." },
      { id: "perspective_taking", label: "Perspective-Taking", value: 3, tip: "Modeling what someone else knows, feels, or needs in a conversation. Theory of mind in action." },
    ],
  },
  {
    name: "Verbal Expression",
    color: "#FF6B6B", alpha: 0.78, domain: "SCI",
    description: "How you use language — precision, tone, rhythm, and whether you naturally reach for metaphor or stay literal.",
    traits: [
      { id: "prosody", label: "Vocal Prosody/Tone", value: 3, tip: "Variation in pitch, rhythm, and emphasis when speaking. 1 = flat/monotone delivery, 5 = expressive and varied." },
      { id: "precision_language", label: "Precision of Language", value: 3, tip: "Tendency toward exact, specific word choice. High scorers say 'SAML 2.0 attribute mapping' not 'that login thing.'" },
      { id: "figurative", label: "Figurative Language Use", value: 3, tip: "Comfort with metaphor, idiom, and non-literal expression — both producing and understanding it." },
    ],
  },
  {
    name: "Restricted Interests",
    color: "#FFE66D", alpha: 0.95, domain: "RRB",
    description: "The depth and intensity of your engagement with topics that capture your attention. Not a flaw — often a superpower.",
    traits: [
      { id: "deep_focus", label: "Deep-Dive Focus", value: 3, tip: "Ability (or compulsion) to go very deep into a subject. The person who reads the RFC, not just the blog post." },
      { id: "topic_intensity", label: "Topic Intensity", value: 3, tip: "How consuming an interest becomes once engaged. 5 = will spend hours configuring SCIM provisioning on a weekend." },
      { id: "novelty_seeking", label: "Novelty vs. Mastery", value: 3, tip: "Preference for exploring new domains (low) vs. mastering known ones (high). Most people are somewhere in between." },
      { id: "system_fascination", label: "Systems Fascination", value: 3, tip: "Drawn to understanding how complex systems work — infrastructure, protocols, organizations, rule sets." },
    ],
  },
  {
    name: "Cognitive Patterns",
    color: "#F7A072", domain: "Extended",
    description: "Your thinking architecture — how you process information, spot patterns, and build mental models of the world.",
    traits: [
      { id: "detail_orientation", label: "Detail Orientation", value: 3, tip: "Noticing and caring about specifics others miss. The person who catches the wrong attribute mapping in a SAML config." },
      { id: "pattern_recognition", label: "Pattern Recognition", value: 3, tip: "Spotting recurring structures across domains — seeing the same anti-pattern in code, process, and org design." },
      { id: "systematic_thinking", label: "Systematic Thinking", value: 3, tip: "Approaching problems methodically rather than intuitively. Step 1 → Step 2 → verify → iterate." },
      { id: "mental_models", label: "Mental Model Building", value: 3, tip: "Constructing internal representations of how things work, then stress-testing them. Engineers do this instinctively." },
    ],
  },
  {
    name: "Flexibility & Routine",
    color: "#C3A6FF", alpha: 0.93, domain: "RRB",
    description: "How you handle change, ambiguity, and disruption — and whether you need things resolved or can sit with uncertainty.",
    traits: [
      { id: "routine_preference", label: "Preference for Routine", value: 3, tip: "How much you rely on predictable structure. 1 = thrives in chaos, 5 = strong need for consistent patterns." },
      { id: "transition_ease", label: "Transition Ease", value: 3, tip: "How smoothly you shift between tasks or contexts. Low = hard context-switches, high = fluid." },
      { id: "tolerance_ambiguity", label: "Tolerance of Ambiguity", value: 3, tip: "Comfort with incomplete information or unclear outcomes. Low scorers need to resolve unknowns quickly." },
      { id: "need_closure", label: "Need for Closure", value: 3, tip: "Drive to reach a definitive answer or conclusion. High = won't leave a problem half-solved." },
    ],
  },
  {
    name: "Sensory Processing",
    color: "#96E6A1", alpha: 0.91, domain: "RRB",
    description: "How your nervous system handles sensory input — sound, light, touch, texture. Wide variation even in neurotypical people.",
    traits: [
      { id: "noise_sensitivity", label: "Noise Sensitivity", value: 3, tip: "Reactivity to ambient sound — open offices, background music, sudden noises. 5 = needs noise-cancelling headphones to focus." },
      { id: "visual_sensitivity", label: "Visual Sensitivity", value: 3, tip: "Response to bright lights, visual clutter, flickering screens. 1 = unbothered, 5 = strongly affected." },
      { id: "tactile_sensitivity", label: "Tactile Sensitivity", value: 3, tip: "Sensitivity to textures, clothing tags, fabrics, temperature. 1 = doesn't notice, 5 = very selective." },
      { id: "sensory_seeking", label: "Sensory Seeking", value: 3, tip: "Active pursuit of sensory input — loud music, spicy food, intense physical activity, fidget tools." },
    ],
  },
  {
    name: "Emotional Regulation",
    color: "#FF8BA7", domain: "Extended",
    description: "How you experience and manage emotions — especially frustration, stress, and the gap between how things are and how they should be.",
    traits: [
      { id: "frustration_threshold", label: "Frustration Intensity", value: 3, tip: "How strongly you react when things are broken or inefficient. High = intense frustration response (not necessarily visible to others)." },
      { id: "recovery_speed", label: "Recovery Speed", value: 3, tip: "How quickly you return to baseline after frustration or stress. 1 = lingers for hours, 5 = bounces back fast." },
      { id: "productive_channeling", label: "Productive Channeling", value: 3, tip: "Ability to convert negative emotion into useful action — fixing the bug, writing the doc, filing the ticket." },
      { id: "emotional_expression", label: "Emotional Expression", value: 3, tip: "How readily emotions are externally visible or verbalized. 1 = very internal, 5 = very expressive." },
    ],
  },
  {
    name: "Motor Patterns",
    color: "#B8D4E3", alpha: 0.90, domain: "RRB",
    description: "Physical movement patterns — repetitive motions, fidgeting, coordination. Often overlooked but part of the full picture.",
    traits: [
      { id: "repetitive_motor", label: "Repetitive Movements", value: 3, tip: "Rocking, hand-flapping, spinning, or other repeated physical movements. 1 = not present, 5 = frequent." },
      { id: "fidgeting", label: "Fidgeting/Stimming", value: 3, tip: "Pen-clicking, leg-bouncing, hair-twisting, or other self-stimulatory behaviors. Nearly everyone does some of this." },
      { id: "coordination", label: "Motor Coordination", value: 3, tip: "General physical coordination — handwriting, sports, fine motor tasks. 1 = clumsy, 5 = very coordinated." },
    ],
  },
  {
    name: "Executive Function",
    color: "#E8A87C", domain: "Extended",
    description: "The command center — planning, prioritizing, switching gears, and your relationship with efficiency (or the lack thereof).",
    traits: [
      { id: "optimization_drive", label: "Optimization Drive", value: 3, tip: "Compulsion to make things better, faster, more efficient. You don't just fix — you optimize." },
      { id: "task_switching", label: "Task Switching", value: 3, tip: "Ability to shift between unrelated tasks without losing momentum. Low = needs long ramp-up time, high = fluid transitions." },
      { id: "planning", label: "Planning & Sequencing", value: 3, tip: "Breaking complex work into ordered steps and executing them. The person who builds the runbook before touching prod." },
      { id: "efficiency_intolerance", label: "Inefficiency Intolerance", value: 3, tip: "How much broken or wasteful processes bother you. 5 = visceral reaction to unnecessary manual steps." },
    ],
  },
];

// DSM-5 aligned domain groupings (Frazier et al., 2025)
const DOMAINS = [
  { name: "SCI", label: "Social Communication & Interaction", color: "#4ECDC4",
    factors: ["Social Communication", "Conversational Skills", "Verbal Expression"] },
  { name: "RRB", label: "Restricted & Repetitive Behaviors", color: "#FFE66D",
    factors: ["Restricted Interests", "Flexibility & Routine", "Sensory Processing", "Motor Patterns"] },
  { name: "Extended", label: "Extended Dimensions", color: "#F7A072",
    factors: ["Cognitive Patterns", "Emotional Regulation", "Executive Function"] },
];

// Population reference data from Frazier et al. (2025), n=3,366
const POPULATION_REFS = [
  { value: 2.1, label: "NT avg", color: "#4ECDC4" },
  { value: 3.7, label: "ASD avg", color: "#FF6B6B" },
];

const allTraitsInit = FACTORS.flatMap((f) =>
  f.traits.map((t) => ({ ...t, factor: f.name, color: f.color }))
);

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  const hideTimer = useRef(null);

  const updatePos = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: rect.left + rect.width / 2, y: rect.top });
  };

  const handleEnter = (e) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    updatePos(e);
    setShow(true);
  };

  const handleClick = (e) => {
    updatePos(e);
    setShow((prev) => {
      if (!prev) {
        hideTimer.current = setTimeout(() => setShow(false), 4000);
        return true;
      }
      return false;
    });
  };

  return (
    <span
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setShow(false)}
      onClick={handleClick}
      style={{ position: "relative", cursor: "help" }}
    >
      {children}
      {show && (
        <span
          style={{
            position: "fixed",
            left: `clamp(16px, ${pos.x}px, calc(100vw - 280px))`,
            top: pos.y - 8,
            transform: "translateX(-50%) translateY(-100%)",
            background: "#1e1e32",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8,
            padding: "12px 16px",
            fontSize: 13,
            lineHeight: 1.65,
            color: "#c0c0c0",
            maxWidth: 320,
            width: "max-content",
            zIndex: 1000,
            pointerEvents: "none",
            boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

function InfoIcon({ color = "#666", size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ verticalAlign: "middle", marginLeft: 3, flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.5" />
      <text x="8" y="11.5" textAnchor="middle" fill={color} fontSize="10" fontWeight="700" fontFamily="serif">i</text>
    </svg>
  );
}

function Chevron({ open, color = "#666" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ transition: "transform 0.25s ease", transform: open ? "rotate(90deg)" : "rotate(0deg)", flexShrink: 0 }}>
      <path d="M6 4l4 4-4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RadarChart({ traits, size = 560, hoveredTrait, onHover, onLeave }) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const levels = 5;
  const angleStep = 360 / traits.length;

  const gridLines = Array.from({ length: levels }, (_, i) => {
    const r = (maxR / levels) * (i + 1);
    return traits.map((_, j) => {
      const p = polarToCartesian(cx, cy, r, j * angleStep);
      return `${p.x},${p.y}`;
    }).join(" ");
  });

  const dataPoints = traits.map((t, i) => {
    const r = (maxR / levels) * t.value;
    return { ...polarToCartesian(cx, cy, r, i * angleStep), trait: t };
  });

  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";

  let idx = 0;
  const factorArcs = FACTORS.map((f) => {
    const start = idx * angleStep;
    const end = (idx + f.traits.length) * angleStep;
    idx += f.traits.length;
    return { start, end, color: f.color };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: size, display: "block", margin: "0 auto" }}>
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1a1a2e" /><stop offset="100%" stopColor="#0f0f1a" /></radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="dotGlow"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <circle cx={cx} cy={cy} r={size / 2} fill="url(#bgGrad)" />
      {factorArcs.map((a, i) => {
        const s1 = polarToCartesian(cx, cy, maxR + 4, a.start + 0.5);
        const s2 = polarToCartesian(cx, cy, maxR + 4, a.end - 0.5);
        return <path key={i} d={`M${s1.x},${s1.y} A${maxR + 4},${maxR + 4} 0 0,1 ${s2.x},${s2.y}`} fill="none" stroke={a.color} strokeWidth="3" opacity="0.5" />;
      })}
      {gridLines.map((pts, i) => <polygon key={i} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />)}
      {/* Population reference rings from Frazier et al. (2025) */}
      {POPULATION_REFS.map((ref) => {
        const r = (maxR / levels) * ref.value;
        const labelPos = polarToCartesian(cx, cy, r, 20);
        return (
          <g key={ref.label}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={ref.color} strokeWidth="1" strokeDasharray="4 4" opacity="0.25" />
            <text x={labelPos.x + 6} y={labelPos.y - 4} fill={ref.color} fontSize="8" fontFamily="'JetBrains Mono', monospace" opacity="0.45">{ref.label}</text>
          </g>
        );
      })}
      {traits.map((_, i) => {
        const p = polarToCartesian(cx, cy, maxR, i * angleStep);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />;
      })}
      <path d={dataPath} fill="rgba(78,205,196,0.1)" stroke="rgba(78,205,196,0.5)" strokeWidth="1.5" filter="url(#glow)" />
      {dataPoints.map((p, i) => {
        const h = hoveredTrait === p.trait.id;
        return (
          <g key={i} onMouseEnter={() => onHover?.(p.trait.id)} onMouseLeave={() => onLeave?.()} style={{ cursor: "pointer" }}>
            {/* Invisible hit area for easier hovering */}
            <circle cx={p.x} cy={p.y} r={14} fill="transparent" />
            <circle cx={p.x} cy={p.y} r={h ? 8 : 4} fill={p.trait.color} stroke={h ? "#fff" : "#0f0f1a"} strokeWidth={h ? 2 : 1.5} opacity={h ? 1 : 0.85} style={{ transition: "all 0.2s", pointerEvents: "none" }} filter={h ? "url(#dotGlow)" : undefined} />
            {h && <>
              <rect x={p.x - 70} y={p.y - 30} width={140} height={22} rx={6} fill="rgba(15,15,26,0.92)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <text x={p.x} y={p.y - 15} textAnchor="middle" fill="#fff" fontSize="11" fontFamily="'JetBrains Mono', monospace" fontWeight="600">{p.trait.label}: {p.trait.value}</text>
            </>}
          </g>
        );
      })}
      {[1, 3, 5].map((v) => {
        const p = polarToCartesian(cx, cy, (maxR / levels) * v, 0);
        return <text key={v} x={p.x + 4} y={p.y - 2} fill="rgba(255,255,255,0.18)" fontSize="9" fontFamily="'JetBrains Mono', monospace">{v}</text>;
      })}
    </svg>
  );
}

function TraitSlider({ trait, onHover, onLeave }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }} onMouseEnter={() => onHover(trait.id)} onMouseLeave={onLeave}>
      <Tooltip text={trait.tip}>
        <span style={{ width: 220, fontSize: 14, color: "#bbb", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "inline-flex", alignItems: "center", gap: 2 }}>
          {trait.label}
          <InfoIcon color={trait.color + "77"} size={14} />
        </span>
      </Tooltip>
      <div style={{ flex: 1, display: "flex", gap: 6, alignItems: "center" }}>
        {[1, 2, 3, 4, 5].map((v) => (
          <button key={v} onClick={() => trait.onChange(v)} style={{
            width: 36, height: 36, borderRadius: 7,
            border: v === trait.value ? `2px solid ${trait.color}` : "1px solid rgba(255,255,255,0.06)",
            cursor: "pointer",
            background: v <= trait.value ? trait.color : "rgba(255,255,255,0.03)",
            opacity: v <= trait.value ? (v === trait.value ? 1 : 0.5) : 0.25,
            transition: "all 0.15s",
            fontSize: 14, color: v <= trait.value ? "#0f0f1a" : "#555", fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace",
          }}>{v}</button>
        ))}
      </div>
    </div>
  );
}

function CollapsibleSection({ title, description, color, children, badge }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "rgba(255,255,255,0.015)", borderRadius: 10,
      border: `1px solid ${open ? color + "33" : "rgba(255,255,255,0.04)"}`,
      marginBottom: 8, overflow: "hidden", transition: "border-color 0.2s",
    }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <Chevron open={open} color={color} />
        <span style={{ flex: 1, fontSize: 16, fontWeight: 600, color, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</span>
        {badge && <span style={{ fontSize: 13, fontWeight: 700, color: "#0f0f1a", background: color, borderRadius: 5, padding: "3px 10px", fontFamily: "'JetBrains Mono', monospace", opacity: 0.8 }}>{badge}</span>}
      </button>
      {open && (
        <div style={{ padding: "0 18px 18px", overflow: "hidden" }}>
          {description && <p style={{ fontSize: 13, color: "#666", lineHeight: 1.65, margin: "0 0 14px", paddingLeft: 26 }}>{description}</p>}
          <div style={{ paddingLeft: 26 }}>{children}</div>
        </div>
      )}
    </div>
  );
}

function InfoPanel({ title, color, open, onToggle, children }) {
  return (
    <div style={{
      background: open ? `${color}08` : "rgba(255,255,255,0.02)",
      border: `1px solid ${open ? color + "20" : "rgba(255,255,255,0.06)"}`,
      borderRadius: 10, marginBottom: 8, overflow: "hidden", transition: "all 0.2s",
    }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: "none", border: "none", cursor: "pointer" }}>
        <Chevron open={open} color={color} />
        <span style={{ fontSize: 15, color: open ? color : "#888", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{title}</span>
      </button>
      {open && <div style={{ padding: "0 18px 18px 44px", fontSize: 14, lineHeight: 1.7, color: "#999" }}>{children}</div>}
    </div>
  );
}

function AppIcon({ onClick }) {
  return (
    <svg
      onClick={onClick}
      width="48" height="48" viewBox="0 0 32 32"
      style={{ cursor: "pointer", display: "block", margin: "0 auto 10px", userSelect: "none" }}
    >
      <circle cx="16" cy="16" r="15" fill="#0f0f1a" stroke="#4ECDC4" strokeWidth="1.5"/>
      <polygon points="16,4 22,12 24,22 16,26 8,22 6,12" fill="none" stroke="#4ECDC4" strokeWidth="1.5" opacity="0.6"/>
      <polygon points="16,6 20,11 23,18 16,24 9,18 7,11" fill="rgba(78,205,196,0.15)" stroke="#4ECDC4" strokeWidth="1" opacity="0.8"/>
      <circle cx="16" cy="6" r="2" fill="#4ECDC4"/>
      <circle cx="20" cy="11" r="2" fill="#F7A072"/>
      <circle cx="23" cy="18" r="2" fill="#FFE66D"/>
      <circle cx="16" cy="24" r="2" fill="#FF6B6B"/>
      <circle cx="9" cy="18" r="2" fill="#C3A6FF"/>
      <circle cx="7" cy="11" r="2" fill="#96E6A1"/>
    </svg>
  );
}

export default function SpectrumProfile() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem("tc_onboarded");
  });
  const [traits, setTraits] = useState(allTraitsInit);
  const [hoveredTrait, setHoveredTrait] = useState(null);
  const [openPanel, setOpenPanel] = useState(null);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const clickTimesRef = useRef([]);
  const savedTraitsRef = useRef(null);
  const easterEggTimerRef = useRef(null);

  const handleIconClick = useCallback(() => {
    if (easterEggActive) return;
    const now = Date.now();
    const clicks = clickTimesRef.current;
    clicks.push(now);
    // Keep only clicks within the last 3 seconds
    const recent = clicks.filter((t) => now - t < 3000);
    clickTimesRef.current = recent;
    if (recent.length >= 10) {
      clickTimesRef.current = [];
      // Save current user traits, load personal profile briefly
      savedTraitsRef.current = traits;
      setTraits((prev) =>
        prev.map((t) => ({ ...t, value: PERSONAL_VALUES[t.id] ?? t.value }))
      );
      setEasterEggActive(true);
      easterEggTimerRef.current = setTimeout(() => {
        setTraits(savedTraitsRef.current);
        savedTraitsRef.current = null;
        setEasterEggActive(false);
      }, 5000);
    }
  }, [traits, easterEggActive]);

  useEffect(() => {
    return () => {
      if (easterEggTimerRef.current) clearTimeout(easterEggTimerRef.current);
    };
  }, []);

  const handleOnboardingComplete = useCallback((traitValues) => {
    setTraits((prev) =>
      prev.map((t) => ({ ...t, value: traitValues[t.id] ?? t.value }))
    );
    setShowOnboarding(false);
  }, []);

  const updateTrait = useCallback((id, v) => {
    setTraits((prev) => prev.map((t) => (t.id === id ? { ...t, value: v } : t)));
  }, []);

  const togglePanel = useCallback((key) => setOpenPanel((prev) => (prev === key ? null : key)), []);

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const factorAverages = FACTORS.map((f) => {
    const ft = traits.filter((t) => t.factor === f.name);
    return { name: f.name, avg: ft.reduce((s, t) => s + t.value, 0) / ft.length, color: f.color };
  });
  const peakFactors = [...factorAverages].sort((a, b) => b.avg - a.avg).slice(0, 3);
  const overallAvg = (traits.reduce((s, t) => s + t.value, 0) / traits.length).toFixed(1);

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", color: "#e0e0e0", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", padding: "32px 24px" }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Space+Grotesk:wght@300;400;600;700&display=swap" rel="stylesheet" />
      <style>{`@keyframes pulse { from { opacity: 0.5; } to { opacity: 1; } }`}</style>

      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <AppIcon onClick={handleIconClick} />
          <h1 style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#4ECDC4", margin: 0, letterSpacing: "-0.5px" }}>
            Trait Constellation
          </h1>
          <p style={{ fontSize: 14, color: "#555", margin: "8px 0 0", lineHeight: 1.5 }}>
            37 traits · 10 factors · Based on the ASDQ (Frazier et al., 2025)
          </p>
          {easterEggActive && (
            <p style={{
              fontSize: 13, color: "#4ECDC4", margin: "10px 0 0",
              animation: "pulse 1s ease-in-out infinite alternate",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              ✦ Sample profile loaded — reverting in a few seconds ✦
            </p>
          )}
        </div>

        {/* Info panels */}
        <InfoPanel title="What is this?" color="#4ECDC4" open={openPanel === "about"} onToggle={() => togglePanel("about")}>
          <p style={{ margin: "0 0 8px" }}>
            The <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12066973/" target="_blank" rel="noopener noreferrer" style={{ color: "#4ECDC4", textDecoration: "underline" }}>Autism Symptom Dimensions Questionnaire</a> (Frazier et al., 2025) is a validated, open-source instrument tested on <strong style={{ color: "#ccc" }}>3,366 participants</strong> with a 9-factor model showing excellent fit (CFI=0.995, RMSEA=0.037). It demonstrated strong screening accuracy (AUC=0.912) and test–retest reliability (r=0.93).
          </p>
          <p style={{ margin: "0 0 8px" }}>
            The Scientific American article (March 2026) showed that the autism spectrum isn't a linear "more/less" scale — it's a <strong style={{ color: "#ccc" }}>unique shape for every person</strong>, like a fingerprint. This interactive version extends the ASDQ's 9 validated factors to 10, adding dimensions for cognitive and executive patterns.
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: "#4ECDC4" }}>Higher scores aren't inherently negative</strong> — deep focus, pattern recognition, and systematic thinking are often professional superpowers. The dashed rings on the radar show population averages: <span style={{ color: "#4ECDC4" }}>neurotypical (2.1)</span> and <span style={{ color: "#FF6B6B" }}>ASD (3.7)</span> from the study.
          </p>
        </InfoPanel>

        <InfoPanel title="How to use this tool" color="#F7A072" open={openPanel === "method"} onToggle={() => togglePanel("method")}>
          <p style={{ margin: "0 0 8px" }}>
            All traits start at <strong style={{ color: "#F7A072" }}>3 (moderate)</strong> — a neutral baseline. Adjust each slider to match your own experience and self-assessment.
          </p>
          <div style={{ marginBottom: 6 }}>
            <span style={{ color: "#4ECDC4", fontWeight: 600 }}>Start broad:</span> Expand each factor group and get a sense of the traits within it. Don't overthink individual scores — you can always come back and refine.
          </div>
          <div style={{ marginBottom: 6 }}>
            <span style={{ color: "#FFE66D", fontWeight: 600 }}>Watch the radar:</span> As you adjust traits, the radar chart updates in real time. The shape of your constellation matters more than any single number.
          </div>
          <div>
            <span style={{ color: "#FF8BA7", fontWeight: 600 }}>No wrong answers:</span> This is a self-reflection tool, not a diagnostic instrument. Your lived experience is the best guide for these values.
          </div>
        </InfoPanel>

        <InfoPanel title="How to read the scale (1–5)" color="#C3A6FF" open={openPanel === "scale"} onToggle={() => togglePanel("scale")}>
          <p style={{ margin: "0 0 10px" }}>
            The ASDQ uses a <strong style={{ color: "#ccc" }}>frequency-based scale</strong> — how often you experience each trait. This matches the validated instrument (Frazier et al., 2025). Higher scores reflect frequency, not dysfunction.
          </p>
          {[
            { v: 1, l: "Never", d: "Trait not experienced. Neurotypical baseline range." },
            { v: 2, l: "Rarely", d: "Occasionally present, minimal daily impact." },
            { v: 3, l: "Sometimes", d: "Noticeable. Periodically affects how you navigate situations." },
            { v: 4, l: "Often", d: "Clearly present. Regularly shapes behavior or experience." },
            { v: 5, l: "Very Often", d: "Strongly present. A defining characteristic of your profile." },
          ].map((s) => (
            <div key={s.v} style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ width: 28, height: 28, borderRadius: 6, background: `rgba(195,166,255,${s.v * 0.16})`, border: "1px solid rgba(195,166,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#C3A6FF", flexShrink: 0 }}>{s.v}</span>
              <div><span style={{ color: "#ddd", fontWeight: 600 }}>{s.l}</span><span style={{ color: "#666", marginLeft: 6 }}>— {s.d}</span></div>
            </div>
          ))}
        </InfoPanel>

        {/* Radar */}
        <RadarChart traits={traits} hoveredTrait={hoveredTrait} onHover={setHoveredTrait} onLeave={() => setHoveredTrait(null)} />

        {/* Factor sections */}
        <div style={{ marginTop: 12, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 4px", marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#666", fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>
              Factors & Traits
            </h2>
            <span style={{ fontSize: 12, color: "#444" }}>
              Tap to expand · click{" "}
              <InfoIcon color="#555" size={12} /> for details
            </span>
          </div>

          {FACTORS.map((f) => {
            const ft = traits.filter((t) => t.factor === f.name);
            const avg = (ft.reduce((s, t) => s + t.value, 0) / ft.length).toFixed(1);
            return (
              <CollapsibleSection key={f.name} title={f.name} description={f.description} color={f.color} badge={<>{avg}{f.alpha && <span style={{ fontSize: 11, color: "#666", marginLeft: 8, fontWeight: 400 }} title={`Cronbach's α = ${f.alpha} (ASDQ reliability)`}>α {f.alpha}</span>}</>}>
                {ft.map((t) => (
                  <TraitSlider key={t.id} trait={{ ...t, onChange: (v) => updateTrait(t.id, v) }} onHover={setHoveredTrait} onLeave={() => setHoveredTrait(null)} />
                ))}
              </CollapsibleSection>
            );
          })}
        </div>

        {/* Summary */}
        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: "#888", margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>Summary</h3>
            <Tooltip text="The overall average across all 37 traits. This single number hides most of the interesting variation — the shape of your radar matters far more than its size.">
              <span style={{ fontSize: 14, color: "#4ECDC4", fontWeight: 700, display: "inline-flex", alignItems: "center" }}>
                Overall: {overallAvg}<InfoIcon color="#4ECDC488" size={14} />
              </span>
            </Tooltip>
          </div>
          {factorAverages.map((f) => (
            <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ width: 190, fontSize: 13, color: f.color, flexShrink: 0 }}>{f.name}</span>
              <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${(f.avg / 5) * 100}%`, height: "100%", background: f.color, borderRadius: 4, opacity: 0.7, transition: "width 0.3s" }} />
              </div>
              <span style={{ fontSize: 14, color: "#777", width: 36, textAlign: "right" }}>{f.avg.toFixed(1)}</span>
            </div>
          ))}
          {/* Domain scores (DSM-5 aligned) */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontSize: 13, color: "#555", display: "block", marginBottom: 10 }}>Domain scores (DSM-5 aligned):</span>
            {DOMAINS.map((d) => {
              const domainTraits = traits.filter((t) => d.factors.includes(t.factor));
              const domainAvg = domainTraits.reduce((s, t) => s + t.value, 0) / domainTraits.length;
              return (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <Tooltip text={`${d.label}: ${d.factors.join(", ")}`}>
                    <span style={{ width: 80, fontSize: 13, color: d.color, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
                      {d.name} <InfoIcon color={d.color + "77"} size={12} />
                    </span>
                  </Tooltip>
                  <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${(domainAvg / 5) * 100}%`, height: "100%", background: d.color, borderRadius: 4, opacity: 0.7, transition: "width 0.3s" }} />
                  </div>
                  <span style={{ fontSize: 14, color: "#777", width: 36, textAlign: "right" }}>{domainAvg.toFixed(1)}</span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontSize: 13, color: "#555" }}>Peak factors: </span>
            {peakFactors.map((p, i) => (
              <span key={p.name} style={{ fontSize: 13, color: p.color, fontWeight: 600 }}>
                {p.name} ({p.avg.toFixed(1)}){i < 2 ? " · " : ""}
              </span>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12, color: "#333", textAlign: "center", lineHeight: 1.6 }}>
          Inspired by the <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12066973/" target="_blank" rel="noopener noreferrer" style={{ color: "#555", textDecoration: "underline" }}>Autism Symptom Dimensions Questionnaire (Frazier et al., 2025)</a> as visualized in Scientific American, March 2026.
          <br />This is an interactive conversation artifact — not a clinical or diagnostic instrument.
        </p>
      </div>
    </div>
  );
}
