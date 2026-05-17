import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Card, CardContent } from "./ui/card";
import { Lightbulb, Wrench, RefreshCw, AlertCircle } from "lucide-react";

gsap.registerPlugin(useGSAP);

export default function Recommendations({ recommendations }) {
  const container = useRef(null);

  useGSAP(() => {
    if (recommendations.length > 0) {
      gsap.from(".rec-card", {
        opacity: 0,
        x: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      });
    }
  }, { scope: container, dependencies: [recommendations] });

  if (!recommendations || recommendations.length === 0) return null;

  const getIcon = (text) => {
    if (text.includes("Update") && text.includes("Major")) return <AlertCircle className="w-5 h-5 text-[#F87171]" />;
    if (text.includes("replacing")) return <RefreshCw className="w-5 h-5 text-[#FBBF24]" />;
    if (text.includes("Update")) return <Wrench className="w-5 h-5 text-[#FF6B35]" />;
    return <Lightbulb className="w-5 h-5 text-[#FF6B35]" />;
  };

  return (
    <div ref={container} className="mb-8 print-break-inside-avoid">
      <h3 className="text-lg font-bold mb-4 text-[#FAFAFA]">Actionable Recommendations</h3>
      <div className="grid gap-3">
        {recommendations.map((rec, i) => (
          <Card key={i} className="rec-card bg-[#0F0F0F] border-[#1E1E1E] border hover:border-[#FF6B35]/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              {getIcon(rec)}
              <span className="text-sm font-medium text-[#FAFAFA]">{rec}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}