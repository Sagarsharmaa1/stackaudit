const STORAGE_KEY = "stackaudit_history";

export function saveAudit(reportData) {
  try {
    const history = getAudits();
    
    const auditEntry = {
      id: Date.now(),
      name: reportData.name,
      date: new Date().toISOString(),
      score: reportData.score,
      stats: reportData.stats,
      data: reportData
    };

    const newHistory = [auditEntry, ...history.filter(h => h.name !== reportData.name)].slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch {
    // Ignore storage errors
  }
}

export function getAudits() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}