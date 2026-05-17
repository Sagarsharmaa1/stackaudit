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
    if (text.includes("Update") && text.includes("Major")) return <AlertCircle className="w-5 h-5 text-destructive" />;
    if (text.includes("replacing")) return <RefreshCw className="w-5 h-5 text-warning" />;
    if (text.includes("Update")) return <Wrench className="w-5 h-5 text-accent" />;
    return <Lightbulb className="w-5 h-5 text-primary" />;
  };

  return (
    <div ref={container} className="mb-8 print-break-inside-avoid">
      <h3 className="text-lg font-bold mb-4">Actionable Recommendations</h3>
      <div className="grid gap-3">
        {recommendations.map((rec, i) => (
          <Card key={i} className="rec-card bg-card border-border hover:border-accent/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              {getIcon(rec)}
              <span className="text-sm font-medium">{rec}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}