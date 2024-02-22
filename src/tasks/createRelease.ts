import * as fs from "fs";
import { logger } from "@/src/utils/logger";
import inquirer from "inquirer";
import * as util from "util";

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
const accessAsync = util.promisify(fs.access);
const mkdirAsync = util.promisify(fs.mkdir);

export default async function createRelease() {
  logger.info("In progress.");

  // Ensure the .release directory exists
  try {
    await accessAsync(".release", fs.constants.F_OK);
  } catch (error) {
    if (error.code === "ENOENT") {
      // Directory doesn't exist, create it
      await mkdirAsync(".release");
      logger.info("Created .release directory.");
    }
  }

  // Read tag
  const tag = await inquirer.prompt([
    { type: "input", name: "value", message: "Enter the tag for the release:" },
  ]);

  // Read release note
  const releaseNotes = await inquirer.prompt([
    {
      type: "editor",
      name: "value",
      message: "Enter the release notes:",
    },
  ]);

  // Read release type
  const releaseType = await inquirer.prompt([
    {
      type: "list",
      name: "value",
      message: "Choose your release type: ",
      choices: ["Major", "Minor", "Patch"],
    },
  ]);

  // 1. If there are releaseNotes then create a file named .release/release-notes.md
  if (releaseNotes.value) {
    await writeFileAsync(".release/release-notes.md", releaseNotes.value);
    logger.info("Release notes saved.");
  }

  // 2. If there is a tag, add the tag to .release/config.json
  if (tag.value) {
    const config = { tag: tag.value };
    await writeFileAsync(
      ".release/config.json",
      JSON.stringify(config, null, 2)
    );
    logger.info("Tag added to config.");
  }

  // 3. If there is a releaseType, add the releaseType to .release/config.json
  if (releaseType.value) {
    try {
      await accessAsync(".release/config.json", fs.constants.F_OK);
    } catch (error) {
      if (error.code === "ENOENT") {
        // File doesn't exist, create it with default content
        const defaultConfig = { tag: "", releaseType: "" };
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
    const config = { ...configFile, releaseType: releaseType.value };
    await writeFileAsync(
      ".release/config.json",
      JSON.stringify(config, null, 2)
    );
    logger.info("Release type added to config.");
  }

  console.log("🚦 ~ createRelease ~ tag:", tag);
  console.log("🚦 ~ createRelease ~ releaseNotes:", releaseNotes);
  console.log("🚦 ~ createRelease ~ releaseType:", releaseType);
}
