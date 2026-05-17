import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Package, AlertTriangle, ShieldCheck, ArrowUpCircle } from "lucide-react";

gsap.registerPlugin(useGSAP);

export default function OverviewCards({ stats }) {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from(".stat-card", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    });

    const numbers = document.querySelectorAll(".stat-number");
    numbers.forEach((el) => {
      const target = parseInt(el.getAttribute("data-target"), 10);
      gsap.to(el, {
        innerHTML: target,
        duration: 1.5,
        snap: { innerHTML: 1 },
        ease: "power2.out",
        onUpdate: function() {
          el.innerHTML = Math.round(el.innerHTML);
        }
      });
    });
  }, { scope: container });

  const cards = [
    { title: "Total Dependencies", value: stats.total, icon: Package, color: "text-primary" },
    { title: "Outdated", value: stats.outdated, icon: ArrowUpCircle, color: "text-warning" },
    { title: "Vulnerable / Major", value: stats.vulnerable, icon: AlertTriangle, color: "text-destructive" },
    { title: "Up to Date", value: stats.upToDate, icon: ShieldCheck, color: "text-accent" },
  ];

  return (
    <div ref={container} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((c, i) => (
        <Card key={i} className="stat-card bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
            <c.icon className={`w-4 h-4 ${c.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              <span className="stat-number" data-target={c.value}>0</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}