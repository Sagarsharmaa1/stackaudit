export async function fetchBundleSize(packageName, version) {
  try {
    const response = await fetch(`https://bundlephobia.com/api/size?package=${packageName}@${version}`);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      size: data.size,
      gzip: data.gzip
    };
  } catch {
    return null;
  }
}