import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function HealthScore({ score }) {
  const container = useRef(null);
  const circleRef = useRef(null);
  
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s > 75) return "var(--healthy)";
    if (s > 50) return "var(--warning)";
    return "var(--danger)";
  };

  const getLabel = (s) => {
    if (s > 75) return "Healthy";
    if (s > 50) return "Fair";
    return "Poor";
  };

  useGSAP(() => {
    gsap.fromTo(circleRef.current,
      { strokeDashoffset: circumference },
      { strokeDashoffset, duration: 2, ease: "power3.out" }
    );

    const scoreEl = document.querySelector(".health-score-number");
    gsap.to(scoreEl, {
      innerHTML: score,
      duration: 2,
      snap: { innerHTML: 1 },
      ease: "power3.out",
      onUpdate: function() {
        scoreEl.innerHTML = Math.round(scoreEl.innerHTML);
      }
    });

    gsap.from(".health-label", {
      opacity: 0,
      y: 10,
      duration: 0.5,
      delay: 1.5
    });
  }, { scope: container, dependencies: [score] });

  return (
    <div ref={container} className="flex flex-col items-center justify-center p-8 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl mb-8 shadow-sm">
      <div className="relative flex items-center justify-center w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-[var(--border)]"
          />
          <circle
            ref={circleRef}
            cx="80"
            cy="80"
            r={radius}
            stroke={getColor(score)}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className={`transition-colors duration-500 ${score > 75 ? "health-ring-glow" : ""}`}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold font-mono text-[var(--text-primary)] health-score-number">0</span>
          <span className="text-xs text-[var(--text-muted)] mt-1">/ 100</span>
        </div>
      </div>
      <h2 className="mt-4 text-xl font-bold health-label" style={{ color: getColor(score) }}>
        {getLabel(score)}
      </h2>
    </div>
  );
}