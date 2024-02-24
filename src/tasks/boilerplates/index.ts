import { boilerplatesChoices } from "@/src/constants";
import inquirer from "inquirer";
import frontend from "./frontend";
import backend from "./backend";
import { fileExists, logger } from "@/src/utils";

export default async function boilerplates() {
  //   if (fileExists("package.json")) {
  //     logger.error("Project already exists, please choose an empty directory");
  //     process.exit(0);
  //   }
  // Ask for boilerplates options
  const boilerplateChoice = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "Which boilerplate are you looking for?",
      choices: boilerplatesChoices,
    },
  ]);
  // Frontend
  if (boilerplateChoice.type === boilerplatesChoices[0]) {
    await frontend();
  }
  // Backend
  if (boilerplateChoice.type === boilerplatesChoices[1]) {
    await backend();
  }
}
