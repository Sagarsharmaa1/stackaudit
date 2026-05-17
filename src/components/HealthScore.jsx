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
    if (s > 75) return "#4ADE80";
    if (s > 50) return "#FBBF24";
    return "#F87171";
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
    <div ref={container} className="flex flex-col items-center justify-center p-8 bg-[#0F0F0F] border border-[#1E1E1E] rounded-xl mb-8 shadow-sm">
      <div className="relative flex items-center justify-center w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-[#1E1E1E]"
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
            style={score > 75 ? { filter: "drop-shadow(0 0 8px #4ADE80)" } : {}}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold font-mono text-[#FAFAFA] health-score-number">0</span>
          <span className="text-xs text-[#525252] mt-1">/ 100</span>
        </div>
      </div>
      <h2 className="mt-4 text-xl font-bold health-label" style={{ color: getColor(score) }}>
        {getLabel(score)}
      </h2>
    </div>
  );
}