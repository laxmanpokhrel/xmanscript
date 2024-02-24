import * as fs from "fs";
import * as path from "path";

function copyFileFromNpxRegistry(source: string, destination: string) {
  // Get the path to the 'registry' folder within the npx package
  const npxPackageDirectory = path.dirname(require.resolve("npx"));
  const registryFolder = path.join(npxPackageDirectory, "registry");

  // Check if the 'registry' folder exists
  if (fs.existsSync(registryFolder)) {
    // Copy the desired file from the 'registry' folder to the local directory
    const sourceFile = path.join(registryFolder, source);
    const destinationFile = path.join(process.cwd(), destination);
    fs.copyFileSync(sourceFile, destinationFile);
  }
}

export default copyFileFromNpxRegistry;
