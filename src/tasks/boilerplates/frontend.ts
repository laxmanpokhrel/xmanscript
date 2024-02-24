import { frontendOptions } from "@/src/constants";
import { configurePackageJson, getRepoName } from "@/src/utils";
import runCommand from "@/src/utils/runCommand";
import chalk from "chalk";
import inquirer from "inquirer";

export default async function frontend() {
  const branchName = "main";

  // Ask for frontend option
  const frontendOption = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "Choose a frontend boilerplate option: ",
      choices: [
        ...new Set(
          frontendOptions.reduce(
            (acc: string[], item: Record<string, string>) => [
              ...acc,
              item.name,
            ],
            []
          )
        ),
      ],
    },
  ]);

  const { repoName } = await getRepoName();

  if (!repoName) {
    console.log(chalk.red("Project name not provided."));
    process.exit(1);
  }

  // Create checkout command
  const gitCheckOutCommand = `git clone --depth 1 -b ${branchName} ${
    frontendOptions.find((item) => item.name === frontendOption.type).repo
  } ${repoName}`;

  // Clone the repo
  if (gitCheckOutCommand) {
    const checkOut = await runCommand(gitCheckOutCommand, "Copying files");
    if (!checkOut) process.exit(1);
  }

  // Configure the package.json name
  await configurePackageJson(repoName);

  // Install dependencies
  const installedDeps = await runCommand(
    `cd ${repoName} && npm i`,
    "Installing dependencies"
  );
  if (!installedDeps) process.exit(1);

  // Initialize new .git folder
  const initializeGit = await runCommand(
    `cd ${repoName} && rm -rf .git && git init && git branch -M main && git add . && git commit -m "Initial Commit"`,
    "Initializing project"
  );
  if (!initializeGit) process.exit(1);

  console.log(`
  ${chalk.cyan.bold(
    "\n-----------------------------------------------------------------------"
  )}
  ${chalk.white.bold(
    "Successfully Initialised: " + chalk.yellowBright(repoName) + "  🚀"
  )}
  ${chalk.white.bold(
    "Run: " +
      chalk.yellow(`' cd ${repoName} && npm run dev '`) +
      " to start development server."
  )}
  ${chalk.cyan.bold(
    "-----------------------------------------------------------------------\n"
  )}
  `);
}
