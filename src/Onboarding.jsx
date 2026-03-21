import { useState, useEffect, useRef, useCallback } from "react";

const QUESTIONS = [
  {
    factor: "Social Communication",
    prompt: "You enter a room full of strangers. Their eyes find you.",
    sub: "What happens next?",
    options: [
      { value: 1, text: "I meet their gaze. I belong here." },
      { value: 2, text: "I scan the room. I find a face I can work with." },
      { value: 3, text: "I feel the weight of it. I manage." },
      { value: 4, text: "Something tightens. I look for the edges of the room." },
      { value: 5, text: "The air thickens. I calculate every step to the corner." },
    ],
  },
  {
    factor: "Conversational Skills",
    prompt: "A conversation drifts. Someone is saying something important between the words.",
    sub: "Do you hear it?",
    options: [
      { value: 1, text: "Always. The subtext is louder than the words." },
      { value: 2, text: "Usually. I catch the important shifts." },
      { value: 3, text: "Sometimes. It depends on who's speaking." },
      { value: 4, text: "Rarely. I hear what's said, not what's meant." },
      { value: 5, text: "The words are the words. What else is there?" },
    ],
  },
  {
    factor: "Verbal Expression",
    prompt: "Your thoughts take shape. They rise from somewhere deep.",
    sub: "How do they sound when they reach the surface?",
    options: [
      { value: 1, text: "Loose. Flowing. Whatever feels right in the moment." },
      { value: 2, text: "Clear enough. People seem to follow." },
      { value: 3, text: "Careful. I choose my words, but not obsessively." },
      { value: 4, text: "Precise. Each word is selected. Deliberate." },
      { value: 5, text: "Surgical. The exact word or no word at all." },
    ],
  },
  {
    factor: "Restricted Interests",
    prompt: "Something catches your attention. A thread leading deeper into the dark.",
    sub: "How far do you follow it?",
    options: [
      { value: 1, text: "I glance. I move on. There are other threads." },
      { value: 2, text: "I tug at it a little. Interesting, but not consuming." },
      { value: 3, text: "I follow for a while. Sometimes I lose track of time." },
      { value: 4, text: "I follow until I understand. Hours dissolve." },
      { value: 5, text: "I don't stop. The thread becomes the world." },
    ],
  },
  {
    factor: "Cognitive Patterns",
    prompt: "The world is full of hidden architecture. Patterns beneath patterns.",
    sub: "How clearly do you see them?",
    options: [
      { value: 1, text: "I see what's in front of me. That's enough." },
      { value: 2, text: "Sometimes a pattern emerges. I note it and move on." },
      { value: 3, text: "I notice patterns regularly. They help me navigate." },
      { value: 4, text: "I see structure everywhere. It's hard to unsee." },
      { value: 5, text: "Everything is connected. The pattern is all I see." },
    ],
  },
  {
    factor: "Flexibility & Routine",
    prompt: "The plan changes. The path you mapped dissolves. The ground shifts.",
    sub: "What happens inside you?",
    options: [
      { value: 1, text: "I adapt instantly. Plans are just suggestions." },
      { value: 2, text: "A brief adjustment. I find the new path quickly." },
      { value: 3, text: "I feel it. I recalibrate. It takes a moment." },
      { value: 4, text: "Something cracks. I need time to rebuild the map." },
      { value: 5, text: "The ground drops away. I need the plan back." },
    ],
  },
  {
    factor: "Sensory Processing",
    prompt: "The room hums. Fluorescent light flickers. Fabric presses against skin.",
    sub: "How much do you feel?",
    options: [
      { value: 1, text: "Barely anything. The world is soft and quiet." },
      { value: 2, text: "Some things register. I can tune most of it out." },
      { value: 3, text: "I notice. Some days more than others." },
      { value: 4, text: "Too much. I build walls against the input." },
      { value: 5, text: "Everything. All at once. Always." },
    ],
  },
  {
    factor: "Emotional Regulation",
    prompt: "Something breaks. Something that should work, doesn't. Again.",
    sub: "What rises in you?",
    options: [
      { value: 1, text: "A shrug. Things break. I'll fix it or I won't." },
      { value: 2, text: "Mild frustration. It passes quickly." },
      { value: 3, text: "A hot flash of irritation. I channel it somewhere." },
      { value: 4, text: "A wave. Strong. I need a moment before I can respond." },
      { value: 5, text: "Fire. It consumes me until I make it right." },
    ],
  },
  {
    factor: "Motor Patterns",
    prompt: "Your body has its own language. Its own rhythms. Its own needs.",
    sub: "How loudly does it speak?",
    options: [
      { value: 1, text: "Quietly. I'm still. Contained." },
      { value: 2, text: "A murmur. The occasional fidget, nothing more." },
      { value: 3, text: "It speaks. Tapping, bouncing, something always moving." },
      { value: 4, text: "Loudly. My body needs to move, to stim, to regulate." },
      { value: 5, text: "Constantly. Movement is how I think. How I exist." },
    ],
  },
  {
    factor: "Executive Function",
    prompt: "There is a system in front of you. Broken. Inefficient. Begging to be rebuilt.",
    sub: "What do you feel?",
    options: [
      { value: 1, text: "Nothing special. It works well enough." },
      { value: 2, text: "A small itch. I might improve it if I have time." },
      { value: 3, text: "The urge to optimize. I start planning automatically." },
      { value: 4, text: "A physical need. I can't leave it broken." },
      { value: 5, text: "Compulsion. I will rebuild it. I will make it perfect." },
    ],
  },
];

// Map factor names to trait IDs for applying answers
const FACTOR_TRAITS = {
  "Social Communication": ["eye_contact", "social_reciprocity", "greetings", "social_cues"],
  "Conversational Skills": ["turn_taking", "topic_maintenance", "perspective_taking"],
  "Verbal Expression": ["prosody", "precision_language", "figurative"],
  "Restricted Interests": ["deep_focus", "topic_intensity", "novelty_seeking", "system_fascination"],
  "Cognitive Patterns": ["detail_orientation", "pattern_recognition", "systematic_thinking", "mental_models"],
  "Flexibility & Routine": ["routine_preference", "transition_ease", "tolerance_ambiguity", "need_closure"],
  "Sensory Processing": ["noise_sensitivity", "visual_sensitivity", "tactile_sensitivity", "sensory_seeking"],
  "Emotional Regulation": ["frustration_threshold", "recovery_speed", "productive_channeling", "emotional_expression"],
  "Motor Patterns": ["repetitive_motor", "fidgeting", "coordination"],
  "Executive Function": ["optimization_drive", "task_switching", "planning", "efficiency_intolerance"],
};

const FACTOR_COLORS = {
  "Social Communication": "#4ECDC4",
  "Conversational Skills": "#45B7AA",
  "Verbal Expression": "#FF6B6B",
  "Restricted Interests": "#FFE66D",
  "Cognitive Patterns": "#F7A072",
  "Flexibility & Routine": "#C3A6FF",
  "Sensory Processing": "#96E6A1",
  "Emotional Regulation": "#FF8BA7",
  "Motor Patterns": "#B8D4E3",
  "Executive Function": "#E8A87C",
};

const PHASES = { INTRO: 0, QUESTIONS: 1, REVEAL: 2 };

function TypeWriter({ text, speed = 40, onDone, className, style }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    setDone(false);
  }, [text]);

  useEffect(() => {
    if (idx.current >= text.length) {
      setDone(true);
      onDone?.();
      return;
    }
    const timer = setTimeout(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, text, speed, onDone]);

  return (
    <span className={className} style={style}>
      {displayed}
      {!done && <span style={{ animation: "blink 0.8s step-end infinite", color: "#4ECDC4" }}>▌</span>}
    </span>
  );
}

function GlitchText({ children, style }) {
  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      <span aria-hidden style={{
        position: "absolute", top: 0, left: 0, zIndex: 0,
        color: "#FF6B6B", clipPath: "inset(10% 0 60% 0)",
        animation: "glitch1 3s infinite linear alternate",
      }}>{children}</span>
      <span aria-hidden style={{
        position: "absolute", top: 0, left: 0, zIndex: 0,
        color: "#4ECDC4", clipPath: "inset(50% 0 20% 0)",
        animation: "glitch2 2.5s infinite linear alternate-reverse",
      }}>{children}</span>
    </span>
  );
}

function FloatingParticles({ count = 30, color = "#4ECDC4" }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * -20,
      opacity: 0.1 + Math.random() * 0.3,
    }))
  ).current;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: color,
            opacity: p.opacity,
            animation: `floatParticle ${p.duration}s ${p.delay}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}

function MiniConstellation({ answers, current }) {
  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const total = 10;
  const angleStep = 360 / total;

  const polarToCartesian = (r, angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const points = Array.from({ length: total }, (_, i) => {
    const val = answers[i] ?? 0;
    const r = (maxR / 5) * val;
    return polarToCartesian(r, i * angleStep);
  });

  const gridPoints = Array.from({ length: total }, (_, i) =>
    polarToCartesian(maxR, i * angleStep)
  );

  const factorNames = Object.keys(FACTOR_COLORS);
  const colors = factorNames.map((n) => FACTOR_COLORS[n]);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ display: "block", margin: "0 auto" }}>
      <circle cx={cx} cy={cy} r={maxR} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      {gridPoints.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      ))}
      {answers.filter((a) => a > 0).length >= 2 && (
        <polygon
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="rgba(78,205,196,0.08)"
          stroke="rgba(78,205,196,0.3)"
          strokeWidth="1"
          style={{ transition: "all 0.8s ease" }}
        />
      )}
      {points.map((p, i) =>
        answers[i] > 0 ? (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === current ? 3.5 : 2}
            fill={colors[i]}
            opacity={i === current ? 1 : 0.7}
            style={{ transition: "all 0.6s ease" }}
          />
        ) : null
      )}
    </svg>
  );
}

function ScanLine() {
  return (
    <div style={{
      position: "fixed", left: 0, right: 0, height: 2,
      background: "linear-gradient(90deg, transparent, rgba(78,205,196,0.3), transparent)",
      animation: "scanLine 4s linear infinite",
      pointerEvents: "none", zIndex: 2,
    }} />
  );
}

export default function Onboarding({ onComplete }) {
  const [phase, setPhase] = useState(PHASES.INTRO);
  const [introStep, setIntroStep] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [promptDone, setPromptDone] = useState(false);
  const [subDone, setSubDone] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [answers, setAnswers] = useState(Array(10).fill(0));
  const [revealStep, setRevealStep] = useState(0);
  const containerRef = useRef(null);

  // Intro sequence timing
  useEffect(() => {
    if (phase !== PHASES.INTRO) return;
    const timers = [
      setTimeout(() => setIntroStep(1), 800),    // show glitch title
      setTimeout(() => setIntroStep(2), 2800),    // show subtitle
      setTimeout(() => setIntroStep(3), 4600),    // show begin button
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // When prompt finishes typing, start sub-prompt
  const handlePromptDone = useCallback(() => {
    setPromptDone(true);
  }, []);

  const handleSubDone = useCallback(() => {
    setSubDone(true);
    setTimeout(() => setOptionsVisible(true), 400);
  }, []);

  // Handle selecting an answer
  const handleSelect = (value) => {
    if (transitioning) return;
    setSelectedOption(value);
    setTransitioning(true);

    const newAnswers = [...answers];
    newAnswers[questionIdx] = value;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (questionIdx < QUESTIONS.length - 1) {
        setQuestionIdx((prev) => prev + 1);
        setPromptDone(false);
        setSubDone(false);
        setOptionsVisible(false);
        setSelectedOption(null);
        setTransitioning(false);
      } else {
        // All questions answered → reveal
        setPhase(PHASES.REVEAL);
        setTransitioning(false);
      }
    }, 1200);
  };

  // Reveal sequence
  useEffect(() => {
    if (phase !== PHASES.REVEAL) return;
    const timers = [
      setTimeout(() => setRevealStep(1), 500),
      setTimeout(() => setRevealStep(2), 2000),
      setTimeout(() => setRevealStep(3), 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // Build trait values from answers
  const handleFinish = () => {
    const traitValues = {};
    QUESTIONS.forEach((q, i) => {
      const val = answers[i] || 3;
      const traitIds = FACTOR_TRAITS[q.factor];
      traitIds.forEach((id) => {
        traitValues[id] = val;
      });
    });
    localStorage.setItem("tc_onboarded", "1");
    onComplete(traitValues);
  };

  const question = QUESTIONS[questionIdx];
  const factorColor = question ? FACTOR_COLORS[question.factor] : "#4ECDC4";

  return (
    <div ref={containerRef} style={{
      position: "fixed", inset: 0, background: "#0a0a14",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Space+Grotesk:wght@300;400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes glitch1 {
          0%, 90% { transform: translate(0); }
          92% { transform: translate(-3px, 1px); }
          94% { transform: translate(2px, -1px); }
          96% { transform: translate(-1px, 2px); }
          98% { transform: translate(3px, 0); }
          100% { transform: translate(0); }
        }
        @keyframes glitch2 {
          0%, 88% { transform: translate(0); }
          90% { transform: translate(2px, -2px); }
          93% { transform: translate(-3px, 1px); }
          95% { transform: translate(1px, 2px); }
          97% { transform: translate(-2px, -1px); }
          100% { transform: translate(0); }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: inherit; }
          25% { transform: translateY(-30px) translateX(10px); }
          50% { transform: translateY(-15px) translateX(-15px); opacity: 0.05; }
          75% { transform: translateY(-40px) translateX(5px); }
        }
        @keyframes scanLine {
          0% { top: -2px; }
          100% { top: 100vh; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes constellationReveal {
          0% { transform: scale(0.3); opacity: 0; filter: blur(10px); }
          60% { transform: scale(1.1); opacity: 0.8; filter: blur(2px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }
        @keyframes staticNoise {
          0% { background-position: 0 0; }
          100% { background-position: 100% 100%; }
        }
        @keyframes screenFlicker {
          0%, 97%, 100% { opacity: 1; }
          98% { opacity: 0.6; }
          99% { opacity: 0.9; }
        }
        @keyframes borderGlow {
          0%, 100% { box-shadow: 0 0 0 rgba(78,205,196,0); border-color: rgba(255,255,255,0.08); }
          50% { box-shadow: 0 0 20px rgba(78,205,196,0.1); border-color: rgba(78,205,196,0.2); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse { from { opacity: 0.5; } to { opacity: 1; } }
      `}</style>

      <FloatingParticles color={phase === PHASES.QUESTIONS ? factorColor : "#4ECDC4"} />
      <ScanLine />

      {/* Static noise overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.03,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        animation: "screenFlicker 8s infinite",
      }} />

      <div style={{ position: "relative", zIndex: 5, maxWidth: 600, width: "100%", padding: "0 24px", textAlign: "center" }}>

        {/* ── INTRO PHASE ── */}
        {phase === PHASES.INTRO && (
          <div>
            {introStep >= 1 && (
              <h1 style={{
                fontSize: "clamp(28px, 6vw, 48px)", fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
                color: "#4ECDC4",
                letterSpacing: "-1px",
                margin: "0 0 16px",
                animation: "fadeIn 1.5s ease",
              }}>
                <GlitchText>TRAIT CONSTELLATION</GlitchText>
              </h1>
            )}

            {introStep >= 2 && (
              <p style={{
                fontSize: 13, color: "#555", lineHeight: 1.8, maxWidth: 400, margin: "0 auto 40px",
                animation: "fadeInUp 1s ease",
              }}>
                <TypeWriter
                  text="We're going to ask you ten questions. There are no right answers. Only your answers."
                  speed={35}
                />
              </p>
            )}

            {introStep >= 3 && (
              <button
                onClick={() => setPhase(PHASES.QUESTIONS)}
                style={{
                  background: "none",
                  border: "1px solid rgba(78,205,196,0.3)",
                  color: "#4ECDC4",
                  padding: "14px 48px",
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 500,
                  cursor: "pointer",
                  borderRadius: 8,
                  animation: "fadeInUp 0.8s ease, borderGlow 3s infinite ease-in-out",
                  transition: "all 0.2s",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(78,205,196,0.08)";
                  e.target.style.borderColor = "rgba(78,205,196,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "none";
                  e.target.style.borderColor = "rgba(78,205,196,0.3)";
                }}
              >
                Begin
              </button>
            )}
          </div>
        )}

        {/* ── QUESTION PHASE ── */}
        {phase === PHASES.QUESTIONS && (
          <div style={{ animation: transitioning ? "none" : "fadeIn 0.5s ease" }}>
            {/* Progress */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 12 }}>
                {QUESTIONS.map((_, i) => (
                  <div key={i} style={{
                    width: 24, height: 3, borderRadius: 2,
                    background: i < questionIdx ? FACTOR_COLORS[QUESTIONS[i].factor]
                      : i === questionIdx ? factorColor
                      : "rgba(255,255,255,0.06)",
                    opacity: i <= questionIdx ? 1 : 0.3,
                    transition: "all 0.5s ease",
                  }} />
                ))}
              </div>
              <span style={{
                fontSize: 9, color: factorColor, fontWeight: 600,
                letterSpacing: "3px", textTransform: "uppercase", opacity: 0.6,
              }}>
                {question.factor}
              </span>
            </div>

            {/* Mini constellation */}
            <div style={{ marginBottom: 24, opacity: 0.6 }}>
              <MiniConstellation answers={answers} current={questionIdx} />
            </div>

            {/* Question text */}
            <div style={{
              minHeight: 80, marginBottom: 32,
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "translateY(-10px)" : "translateY(0)",
              transition: "opacity 0.4s, transform 0.4s",
            }}>
              <p style={{ fontSize: "clamp(16px, 3.5vw, 22px)", color: "#ddd", lineHeight: 1.6, margin: "0 0 8px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300 }}>
                <TypeWriter
                  key={`prompt-${questionIdx}`}
                  text={question.prompt}
                  speed={30}
                  onDone={handlePromptDone}
                />
              </p>
              {promptDone && (
                <p style={{ fontSize: "clamp(14px, 3vw, 18px)", color: factorColor, margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
                  <TypeWriter
                    key={`sub-${questionIdx}`}
                    text={question.sub}
                    speed={45}
                    onDone={handleSubDone}
                  />
                </p>
              )}
            </div>

            {/* Options */}
            {optionsVisible && (
              <div style={{
                display: "flex", flexDirection: "column", gap: 8, maxWidth: 460, margin: "0 auto",
                opacity: transitioning ? 0 : 1,
                transition: "opacity 0.3s",
              }}>
                {question.options.map((opt, i) => (
                  <button
                    key={`${questionIdx}-${i}`}
                    onClick={() => handleSelect(opt.value)}
                    disabled={transitioning}
                    style={{
                      background: selectedOption === opt.value
                        ? `${factorColor}15`
                        : "rgba(255,255,255,0.02)",
                      border: selectedOption === opt.value
                        ? `1px solid ${factorColor}60`
                        : "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 10,
                      padding: "14px 18px",
                      textAlign: "left",
                      cursor: transitioning ? "default" : "pointer",
                      color: selectedOption === opt.value ? factorColor : "#999",
                      fontSize: 12,
                      fontFamily: "'JetBrains Mono', monospace",
                      lineHeight: 1.5,
                      transition: "all 0.25s ease",
                      animation: `fadeInUp 0.4s ease ${i * 0.08}s both`,
                      transform: selectedOption === opt.value ? "scale(1.02)" : "scale(1)",
                    }}
                    onMouseEnter={(e) => {
                      if (!transitioning && selectedOption === null) {
                        e.target.style.borderColor = `${factorColor}40`;
                        e.target.style.color = "#ccc";
                        e.target.style.background = "rgba(255,255,255,0.03)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!transitioning && selectedOption === null) {
                        e.target.style.borderColor = "rgba(255,255,255,0.06)";
                        e.target.style.color = "#999";
                        e.target.style.background = "rgba(255,255,255,0.02)";
                      }
                    }}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── REVEAL PHASE ── */}
        {phase === PHASES.REVEAL && (
          <div>
            {revealStep >= 1 && (
              <p style={{
                fontSize: 14, color: "#555", margin: "0 0 24px",
                fontFamily: "'Space Grotesk', sans-serif",
                animation: "fadeIn 1.5s ease",
              }}>
                <TypeWriter
                  text="Mapping complete. Your constellation has taken shape."
                  speed={40}
                />
              </p>
            )}

            {revealStep >= 2 && (
              <div style={{ animation: "constellationReveal 2s ease", marginBottom: 32 }}>
                <MiniConstellation answers={answers} current={-1} />
                <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                  {QUESTIONS.map((q, i) => (
                    <span key={i} style={{
                      fontSize: 9, color: FACTOR_COLORS[q.factor], opacity: 0.6,
                      animation: `fadeIn 0.5s ease ${i * 0.1}s both`,
                    }}>
                      {q.factor.split(" ")[0]} {answers[i]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {revealStep >= 3 && (
              <div style={{ animation: "fadeInUp 0.8s ease" }}>
                <p style={{ fontSize: 11, color: "#555", margin: "0 0 24px", lineHeight: 1.6 }}>
                  These are your starting values. You can fine-tune every trait inside.
                </p>
                <button
                  onClick={handleFinish}
                  style={{
                    background: "linear-gradient(135deg, rgba(78,205,196,0.15), rgba(78,205,196,0.05))",
                    border: "1px solid rgba(78,205,196,0.4)",
                    color: "#4ECDC4",
                    padding: "16px 56px",
                    fontSize: 14,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    cursor: "pointer",
                    borderRadius: 10,
                    letterSpacing: "1px",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "linear-gradient(135deg, rgba(78,205,196,0.25), rgba(78,205,196,0.1))";
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "linear-gradient(135deg, rgba(78,205,196,0.15), rgba(78,205,196,0.05))";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  See Your Constellation →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
