#! /usr/bin/env node

import inquirer from "inquirer";
import { extractFlags } from "@/src/utils";
import { scriptChoices } from "@/src/constants";
import frontend from "@/src/tasks/frontend";
import backend from "@/src/tasks/backend";
import createRelease from "@/src/tasks/createRelease";
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
    } else {
      console.error("Flag not available.");
      showAvailableFlags();
      process.exit(-1);
    }
  } else {
    // Ask for script choice
    const endChoice = await inquirer.prompt([
      {
        type: "list",
        name: "type",
        message: "Which end app are you building?",
        choices: scriptChoices,
      },
    ]);

    // Frontend
    if (endChoice.type === scriptChoices[0]) {
      await frontend();
    }
    // Backend
    if (endChoice.type === scriptChoices[1]) {
      await backend();
    }
    // Create release
    if (endChoice.type === scriptChoices[2]) {
      await createRelease();
    }
    // Create release workflow
    if (endChoice.type === scriptChoices[3]) {
      await backend();
    }
  }
}
main();
