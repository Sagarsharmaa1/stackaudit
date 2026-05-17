export async function fetchNpmData(packageName) {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);
    if (!response.ok) return null;
    const data = await response.json();
    
    const latest = data["dist-tags"]?.latest;
    return {
      latestVersion: latest,
      description: data.description || "",
      repository: data.repository?.url || ""
    };
  } catch {
    return null;
  }
}