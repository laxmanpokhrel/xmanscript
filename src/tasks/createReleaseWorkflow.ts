import * as fs from "fs";
import * as util from "util";
import { logger } from "@/src/utils/logger";

const writeFileAsync = util.promisify(fs.writeFile);
const accessAsync = util.promisify(fs.access);
const mkdirAsync = util.promisify(fs.mkdir);
const readFileAsync = util.promisify(fs.readFile);

export default async function createReleaseWorkflow() {
  logger.info("In progress.");

  // Ensure the .github/workflows directory exists
  try {
    await accessAsync(".github/workflows", fs.constants.F_OK);
  } catch (error) {
    if (error.code === "ENOENT") {
      // Directory doesn't exist, create it
      await mkdirAsync(".github/workflows", { recursive: true });
      logger.info("Created .github/workflows directory.");
    } else {
      logger.error("Error accessing .github/workflows directory:", error);
      return; // Exit function if there's an error accessing the directory
    }
  }

  // Read the content of the template YAML file
  let workflowContent;
  try {
    workflowContent = await readFileAsync(
      "src/templates/release.yaml",
      "utf-8"
    );
  } catch (error) {
    logger.error("Error reading template YAML file:", error);
    return; // Exit function if there's an error reading the file
  }

  // Write the template YAML content to .github/workflows/release.yaml
  try {
    await writeFileAsync(".github/workflows/release.yaml", workflowContent);
    logger.info("Release workflow created.");
  } catch (error) {
    logger.error("Error creating release workflow:", error);
  }

  const scriptsDir = ".github/scripts";
  const scriptFilePath = `${scriptsDir}/release.sh`;

  // Ensure the .github/scripts directory exists
  try {
    await accessAsync(scriptsDir, fs.constants.F_OK);
  } catch (error) {
    if (error.code === "ENOENT") {
      // Directory doesn't exist, create it
      try {
        await mkdirAsync(scriptsDir, { recursive: true });
        logger.info("Created .github/scripts directory.");
      } catch (mkdirError) {
        logger.error("Error creating .github/scripts directory:", mkdirError);
        return; // Exit function if there's an error creating the directory
      }
    } else {
      logger.error("Error accessing .github/scripts directory:", error);
      return; // Exit function if there's an error accessing the directory
    }
  }

  // Read the content of the template script file
  let scriptContent;
  try {
    scriptContent = await readFileAsync("src/templates/release.sh", "utf-8");
  } catch (error) {
    logger.error("Error reading template script file:", error);
    return; // Exit function if there's an error reading the file
  }

  // Write the template script content to .github/scripts/release.sh
  try {
    await writeFileAsync(scriptFilePath, scriptContent);
    logger.info("Release script created.");
  } catch (error) {
    logger.error("Error creating release script:", error);
  }
}
