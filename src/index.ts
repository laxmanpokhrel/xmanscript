#! /usr/bin/env node

import inquirer from "inquirer";
import { extractFlags } from "@/src/utils";
import { starterChoice } from "@/src/constants";
import frontend from "@/src/tasks/boilerplates/frontend";
import backend from "@/src/tasks/boilerplates/backend";
import boilerplates from "@/src/tasks/boilerplates";
import createRelease from "@/src/tasks/createRelease";
import createReleaseWorkflow from "@/src/tasks/createReleaseWorkflow";
import showAvailableFlags from "@/src/utils/showAvailableFlags";

async function main() {
  const flags = extractFlags();
  if (Object.keys(flags).length) {
    if (flags.frontend) {
      await frontend();
    } else if (flags.backend) {
      await backend();
    } else if (flags.help) {
      showAvailableFlags();
      process.exit(0);
    } else if (flags["create-release-data"]) {
      await createRelease();
      process.exit(0);
    } else if (flags["create-release-action"]) {
      await createReleaseWorkflow();
      process.exit(0);
    } else {
      console.error("Flag not available.");
      showAvailableFlags();
      process.exit(1);
    }
  } else {
    // Ask for script choice
    const endChoice = await inquirer.prompt([
      {
        type: "list",
        name: "type",
        message: "What are you looking for?",
        choices: starterChoice,
      },
    ]);

    // Bolierplates
    if (endChoice.type === starterChoice[0]) {
      await boilerplates();
    }
    // Setup github action to deploy npm package
    if (endChoice.type === starterChoice[1]) {
      await createReleaseWorkflow();
    }
    // Create package release data
    if (endChoice.type === starterChoice[2]) {
      await createRelease();
    }
  }
}
main();
