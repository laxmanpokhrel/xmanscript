import * as fs from "fs";
import * as util from "util";
import { fileExists, logger, __dirname } from "@/src/utils";
import ora from "ora";
import * as path from "path";

const writeFileAsync = util.promisify(fs.writeFile);
const accessAsync = util.promisify(fs.access);
const mkdirAsync = util.promisify(fs.mkdir);
const readFileAsync = util.promisify(fs.readFile);

export default async function createReleaseWorkflow() {
  const spinner = ora("Creating release workflow. \n").start();

  if (!fileExists("package.json")) {
    logger.error("Failed to detect a project");
    spinner.fail();
    process.exit(-1);
  }

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
      return;
    }
  }

  // Read the content of the registry YAML file
  let workflowContent;
  try {
    workflowContent = await readFileAsync(
      path.join(__dirname, "/registry/release.yaml"),
      "utf-8"
    );
    // workflowContent = await readFileAsync(path.join(__dirname, "/registry/release.yaml")"registry/release.yaml", "utf-8");
  } catch (error) {
    logger.error("Error reading registry YAML file:", error);
    return;
  }

  // Write the registry YAML content to .github/workflows/release.yaml
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
      try {
        await mkdirAsync(scriptsDir, { recursive: true });
        logger.info("Created .github/scripts directory.");
      } catch (mkdirError) {
        logger.error("Error creating .github/scripts directory:", mkdirError);
        return;
      }
    } else {
      logger.error("Error accessing .github/scripts directory:", error);
      return;
    }
  }

  // Read the content of the registry script file
  let scriptContent;
  try {
    scriptContent = await readFileAsync(
      path.join(__dirname, "/registry/release.sh"),
      "utf-8"
    );
  } catch (error) {
    spinner.fail();
    logger.error("Error reading registry script file:", error);
    process.exit(-1);

    // return;
  }

  // Write the registry script content to .github/scripts/release.sh
  try {
    await writeFileAsync(scriptFilePath, scriptContent);
    logger.info("Release script created.");
  } catch (error) {
    spinner.fail();
    logger.error("Error creating release script:", error);
  }
  spinner.succeed();
}
