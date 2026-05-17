export function parsePackageJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.dependencies && !parsed.devDependencies) {
      throw new Error("No dependencies found in package.json");
    }
    
    const allDeps = {
      ...parsed.dependencies,
      ...parsed.devDependencies
    };

    const dependencies = Object.entries(allDeps).map(([name, version]) => ({
      name,
      versionRange: version,
      cleanVersion: version.replace(/^[^\d]/, "")
    }));

    return {
      name: parsed.name || "Unknown Project",
      dependencies
    };
  } catch (err) {
    throw new Error("Invalid package.json format");
  }
}