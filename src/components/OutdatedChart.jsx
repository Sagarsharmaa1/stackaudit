import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function OutdatedChart({ dependencies }) {
  const outdatedDeps = dependencies.filter(d => d.status !== "up-to-date").slice(0, 10);

  if (outdatedDeps.length === 0) return null;

  const data = outdatedDeps.map(d => {
    const parseVer = (v) => {
      const parts = v.split(".");
      return parseInt(parts[0] || 0) + (parseInt(parts[1] || 0) / 100) + (parseInt(parts[2] || 0) / 10000);
    };

    return {
      name: d.name,
      current: parseVer(d.cleanVersion),
      latest: parseVer(d.latestVersion),
      currentStr: d.cleanVersion,
      latestStr: d.latestVersion,
      status: d.status
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded shadow-md">
          <p className="font-bold mb-2">{label}</p>
          <p className="text-sm text-muted-foreground">Current: <span className="font-mono text-foreground">{payload[0].payload.currentStr}</span></p>
          <p className="text-sm text-muted-foreground">Latest: <span className="font-mono text-foreground">{payload[0].payload.latestStr}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-8 print-break-inside-avoid h-[400px]">
      <h3 className="text-lg font-bold mb-4">Top Outdated Packages</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={70} 
            stroke="var(--muted-foreground)"
            tick={{ fontSize: 12 }}
          />
          <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)' }} />
          <Bar dataKey="current" fill="var(--muted-foreground)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="latest" fill="var(--warning)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}