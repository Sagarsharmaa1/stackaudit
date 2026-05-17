export function calculateScore(dependencies) {
  let score = 100;
  let outdatedCount = 0;
  let vulnerableCount = 0;
  let upToDateCount = 0;
  
  const recommendations = [];

  const analyzedDeps = dependencies.map(dep => {
    let status = "up-to-date";
    let severity = "none";
    
    if (dep.latestVersion && dep.cleanVersion) {
      const currentParts = dep.cleanVersion.split(".");
      const latestParts = dep.latestVersion.split(".");
      
      if (latestParts[0] > currentParts[0]) {
        status = "major";
        severity = "high";
        score -= 5;
        outdatedCount++;
        recommendations.push(`Update ${dep.name} from ${dep.cleanVersion} to ${dep.latestVersion} (Major)`);
      } else if (latestParts[1] > currentParts[1]) {
        status = "minor";
        severity = "medium";
        score -= 2;
        outdatedCount++;
      } else if (latestParts[2] > currentParts[2]) {
        status = "patch";
        severity = "low";
        score -= 0.5;
        outdatedCount++;
      } else {
        upToDateCount++;
      }
    }

    if (dep.bundle && dep.bundle.gzip > 500000) {
      score -= 5;
      recommendations.push(`Consider replacing ${dep.name} (${(dep.bundle.gzip / 1024).toFixed(1)}kb gzip) with a lighter alternative`);
    }

    return { ...dep, status, severity };
  });

  if (dependencies.length > 50) score -= 10;
  if (dependencies.length > 100) score -= 15;

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score,
    analyzedDeps,
    stats: {
      total: dependencies.length,
      outdated: outdatedCount,
      vulnerable: vulnerableCount,
      upToDate: upToDateCount
    },
    recommendations
  };
}