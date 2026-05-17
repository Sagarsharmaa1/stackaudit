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
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 mb-8 print-break-inside-avoid" style={{ width: '100%', minHeight: '300px' }}>
      <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">Top Outdated Packages</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              stroke="var(--text-muted)"
              tick={{ fontSize: 12 }}
            />
            <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-elevated)' }} />
            <Bar dataKey="current" fill="var(--text-muted)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="latest" fill="var(--warning)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}