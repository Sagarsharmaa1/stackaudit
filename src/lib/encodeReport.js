export function encodeReport(reportData) {
  try {
    const jsonString = JSON.stringify(reportData);
    return btoa(encodeURIComponent(jsonString));
  } catch {
    return null;
  }
}

export function decodeReport(hash) {
  try {
    const jsonString = decodeURIComponent(atob(hash));
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}