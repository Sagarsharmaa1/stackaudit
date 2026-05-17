export function parsePackageJson(jsonString) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    throw new Error("Invalid JSON: Please check for syntax errors or trailing commas.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid format: The file must contain a valid JSON object.");
  }

  if (!parsed.dependencies && !parsed.devDependencies) {
    throw new Error("No dependencies found: This package.json doesn't contain a 'dependencies' or 'devDependencies' field.");
  }
  
  const dependencies = [
    ...Object.entries(parsed.dependencies || {}).map(([name, version]) => ({
      name,
      versionRange: version,
      cleanVersion: version.replace(/^[^\d]/, ""),
      isDev: false
    })),
    ...Object.entries(parsed.devDependencies || {}).map(([name, version]) => ({
      name,
      versionRange: version,
      cleanVersion: version.replace(/^[^\d]/, ""),
      isDev: true
    }))
  ];

  return {
    name: parsed.name || "Unknown Project",
    dependencies
  };
}