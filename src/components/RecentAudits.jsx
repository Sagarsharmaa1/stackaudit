import { History, ChevronRight } from "lucide-react";
import { getAudits } from "../lib/storage";

export default function RecentAudits({ onSelect }) {
  const history = getAudits();

  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-16">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <History className="w-5 h-5 text-muted-foreground" />
        Recent Audits
      </h3>
      <div className="grid gap-3">
        {history.map((audit) => (
          <div 
            key={audit.id}
            onClick={() => onSelect(audit.data)}
            className="bg-[var(--bg-surface)] border border-[var(--border)] p-4 rounded flex items-center justify-between cursor-pointer hover:border-[var(--accent)] transition-colors"
          >
            <div>
              <div className="font-bold text-[var(--text-primary)]">{audit.name}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">
                {new Date(audit.date).toLocaleDateString()} • {audit.stats.total} packages
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold text-[var(--healthy)]">
                {audit.score}
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}