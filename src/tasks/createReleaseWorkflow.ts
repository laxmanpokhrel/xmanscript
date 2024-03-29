import * as fs from "fs";
import * as util from "util";
import { fetchFileContent, fileExists, logger } from "@/src/utils";
import ora from "ora";
import chalk from "chalk";

const writeFileAsync = util.promisify(fs.writeFile);
const accessAsync = util.promisify(fs.access);
const mkdirAsync = util.promisify(fs.mkdir);
const owner = "laxmanpokhrel";
const repo = "xmanscript";
const branch = "main";

export default async function createReleaseWorkflow() {
  // const spinner = ora("Creating release workflow. \n").start();

  if (!fileExists("package.json")) {
    logger.error("Failed to detect a project");
    process.exit(0);
    // spinner.fail();
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
    workflowContent = await fetchFileContent(
      owner,
      repo,
      branch,
      "registry/release.yaml"
    );
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
    scriptContent = await fetchFileContent(
      owner,
      repo,
      branch,
      "registry/release.sh"
    );
  } catch (error) {
    // spinner.fail();
    logger.error("Error reading registry script file:", error);
    return;
  }

  // Write the registry script content to .github/scripts/release.sh
  try {
    await writeFileAsync(scriptFilePath, scriptContent);
    logger.info("Release script created.");
  } catch (error) {
    // spinner.fail();
    logger.error("Error creating release script:", error);
  }
  // spinner.succeed();

  console.log(`
${chalk.cyan.bold(
  "\n----------------------------------------------------------------------------------------------------------------------------------------------"
)}
${chalk.yellow(
  "Please replace " +
    chalk.green("<your_release_branch_name>") +
    " with your release branch name in `.github/workflows/release.yaml`."
)}
${chalk.yellow(
  "To ensure that this GitHub Action works correctly, the following steps are necessary:"
)}
${chalk.white(
  "1. Set " +
    chalk.cyan("NPM_TOKEN") +
    " as a GitHub repository secret " +
    chalk.cyan("NPM_TOKEN") +
    " is provided by npm for automation purposes."
)}
${chalk.white(
  "2. Configure your GitHub Actions settings to create and approve pull requests. This setting can be found under your repository's " +
    chalk.cyan("settings > Actions > General") +
    "."
)}
${chalk.white(
  "3. The action will be triggered when changes are pushed to " +
    chalk.green("<your_release_branch_name>") +
    " and include changes in the `.release` folder."
)}
${chalk.white(
  "   If the `.release` folder doesn't exist, you can create it manually. Alternatively, for the first-time setup, you can run " +
    chalk.cyan("`npx xmanscript --create-release-data`") +
    " and follow the prompts."
)}
${chalk.cyan.bold(
  "----------------------------------------------------------------------------------------------------------------------------------------------\n"
)}
`);
}
