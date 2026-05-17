import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import DropZone from "../components/DropZone";
import RecentAudits from "../components/RecentAudits";
import { encodeReport } from "../lib/encodeReport";

export default function Home() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    let time = 0;
    const draw = () => {
      time += 0.0008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const spacing = 60;
      const dotSize = 1.5;
      ctx.fillStyle = "#1A1A1A";

      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          const offset = (x + y) * 0.01;
          const floatY = Math.sin(time + offset) * 3;
          
          ctx.beginPath();
          ctx.arc(x, y + floatY, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleParsed = (parsedData) => {
    navigate("/report", { state: { parsedData } });
  };

  const handleSelectAudit = (reportData) => {
    const hash = encodeReport(reportData);
    navigate(`/report#${hash}`);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] py-12">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />
      
      <div className="relative z-1 text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-[#FAFAFA]">
          Audit your dependencies <span className="text-[#FF6B35]">in seconds.</span>
        </h1>
        <p className="text-lg text-[#525252] max-w-2xl mx-auto">
          Drop your package.json to get an instant visual report of bundle sizes, outdated packages, and vulnerabilities without installing anything.
        </p>
      </div>

      <div className="relative z-1 w-full flex flex-col items-center">
        <DropZone onParsed={handleParsed} />
        <RecentAudits onSelect={handleSelectAudit} />
      </div>
    </div>
  );
}