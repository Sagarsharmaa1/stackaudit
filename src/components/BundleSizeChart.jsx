import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";

export default function BundleSizeChart({ dependencies }) {
  const withSize = dependencies.filter(d => d.bundle && d.bundle.gzip > 0);
  if (withSize.length === 0) return null;

  const sorted = [...withSize].sort((a, b) => b.bundle.gzip - a.bundle.gzip);
  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5);
  
  const restSize = rest.reduce((acc, curr) => acc + curr.bundle.gzip, 0);
  
  const data = [
    ...top.map(d => ({ name: d.name, value: d.bundle.gzip, version: d.cleanVersion })),
    ...(restSize > 0 ? [{ name: "Others", value: restSize, version: "" }] : [])
  ];

  const totalGzip = sorted.reduce((acc, curr) => acc + curr.bundle.gzip, 0);
  const totalKb = (totalGzip / 1024).toFixed(1);

  const colors = ["var(--destructive)", "#ff6b6b", "#ff8787", "#ff9f9f", "#ffb8b8", "var(--muted-foreground)"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border p-3 rounded shadow-md flex flex-col gap-2">
          <p className="font-bold">{data.name}</p>
          <p className="text-sm font-mono">{(data.value / 1024).toFixed(1)} KB</p>
          {data.name !== "Others" && (
            <Button variant="outline" size="sm" className="mt-2 text-xs h-7" asChild>
              <a href={`https://bundlephobia.com/package/${data.name}@${data.version}`} target="_blank" rel="noreferrer">
                Find Alternative <ExternalLink className="w-3 h-3 ml-2" />
              </a>
            </Button>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-8 print-break-inside-avoid flex flex-col items-center" style={{ width: '100%', minHeight: '300px' }}>
      <h3 className="text-lg font-bold mb-2 w-full text-left">Bundle Size Breakdown</h3>
      <p className="text-sm text-muted-foreground w-full text-left mb-4">
        Total Estimated Gzip: <span className="font-mono font-bold text-foreground">{totalKb} KB</span>
      </p>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}