#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import { extractFlags } from "@/utils";
import { scriptChoices } from "@/constants";
import frontend from "@/tasks/frontend";
import backend from "@/tasks/backend";
import showAvailableFlags from "./utils/showAvailableFlags";

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
  }
}
main();
