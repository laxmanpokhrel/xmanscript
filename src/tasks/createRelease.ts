import * as fs from "fs";
import * as util from "util";
import { logger } from "@/src/utils/logger";
import inquirer from "inquirer";
import chalk from "chalk";

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
const accessAsync = util.promisify(fs.access);
const mkdirAsync = util.promisify(fs.mkdir);
const rmdirAsync = util.promisify(fs.rm);

export default async function createRelease() {
  logger.info("In progress.");

  // Read release note
  const releaseNotes = await inquirer.prompt([
    {
      type: "editor",
      name: "value",
      message: "Enter the release notes:",
    },
  ]);

  // Read tag
  const tag = await inquirer.prompt([
    { type: "input", name: "value", message: "Enter the tag for the release:" },
  ]);

  // Read release type
  const releaseType = await inquirer.prompt([
    {
      type: "list",
      name: "value",
      message: "Choose your version upgrade type:",
      choices: ["--latest (default)", "--prerelease"],
    },
  ]);
  // Read version upgrade type
  const versionUpgradeType = await inquirer.prompt([
    {
      type: "list",
      name: "value",
      message: "Choose your version upgrade type:",
      choices: ["patch", "minor", "major"],
    },
  ]);

  // Check if .release directory exists and delete it if it does
  try {
    await accessAsync(".release", fs.constants.F_OK);
    await rmdirAsync(".release", { recursive: true });
    logger.info(".release directory deleted.");
  } catch (error) {
    if (error.code !== "ENOENT") {
      // Log if there's an error other than directory not found
      logger.error("Error deleting .release directory:", error);
    }
  }

  // Ensure the .release directory exists
  try {
    await mkdirAsync(".release");
    logger.info("Created .release directory.");
  } catch (error) {
    logger.error("Error creating .release directory:", error);
    return; // Exit function if there's an error creating the directory
  }

  // If there are releaseNotes then create a file named .release/release-notes.txt
  if (releaseNotes.value) {
    await writeFileAsync(".release/release-notes.txt", releaseNotes.value);
    logger.info("Release notes saved.");
  }

  // If there is a tag, add the tag to .release/config.json
  if (tag.value.length) {
    const config = { tag: tag.value };
    await writeFileAsync(
      ".release/config.json",
      JSON.stringify(config, null, 2)
    );
    logger.info("Tag added to config.");
  }

  // If there is a versionUpgradeType, add the versionUpgradeType to .release/config.json
  if (versionUpgradeType.value) {
    try {
      await accessAsync(".release/config.json", fs.constants.F_OK);
    } catch (error) {
      if (error.code === "ENOENT") {
        // File doesn't exist, create it with default content

        const defaultConfig = { versionUpgradeType: "" };
        await writeFileAsync(
          ".release/config.json",
          JSON.stringify(defaultConfig, null, 2)
        );
        logger.info("Config file created.");
      }
    }

    const configFileContent = await readFileAsync(
      ".release/config.json",
      "utf-8"
    );

    const configFile = JSON.parse(configFileContent);
    const config = {
      ...configFile,
      versionUpgradeType: versionUpgradeType.value,
    };
    await writeFileAsync(
      ".release/config.json",
      JSON.stringify(config, null, 2)
    );
    logger.info("VersionUpgradeType added to config.");
  }

  // If there is a release type, add the releaseType to .release/config.json
  if (releaseType.value) {
    try {
      await accessAsync(".release/config.json", fs.constants.F_OK);
    } catch (error) {
      if (error.code === "ENOENT") {
        // File doesn't exist, create it with default content

        const defaultConfig = { releaseType: "--latest" };
        await writeFileAsync(
          ".release/config.json",
          JSON.stringify(defaultConfig, null, 2)
        );
        logger.info("Config file created.");
      }
    }

    const configFileContent = await readFileAsync(
      ".release/config.json",
      "utf-8"
    );

    const configFile = JSON.parse(configFileContent);
    const config = {
      ...configFile,
      releaseType: releaseType.value.split(" ")[0],
    };
    await writeFileAsync(
      ".release/config.json",
      JSON.stringify(config, null, 2)
    );
    logger.info("VersionUpgradeType added to config.");
  }

  console.log(`
${chalk.cyan.bold(
  "\n----------------------------------------------------------------------------------------------------------------------------------------------"
)}
${chalk.white.bold(
  "You can now stage the changes just created and push to the release branch to trigger the release workflow."
)}
${chalk.cyan.bold(
  "----------------------------------------------------------------------------------------------------------------------------------------------\n"
)}
`);
}
