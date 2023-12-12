#! /usr/bin/env node

import { exec } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import util from "util";

const execAsync = util.promisify(exec);

// choice options
const endOptions = ["Frontend", "Backend"];
const frontendOptions = [
  "Minimal react app (vite + ts + tailwind)",
  "Minimal react app with storybook (vite + ts + tailwind + storybook)",
  "Minial storybook (vite + ts + storybook)",
];

//   branch to clone
let branchName = "main";

const commandArgs = process.argv;
const repoName = commandArgs[2];

let gitCheckOutCommand = undefined;
let installDepsCommand = `cd ${repoName} && npm i`;
let initializeGitCommand = `cd ${repoName} && rm -rf .git && git init && git branch -M main && git add . && git commit -m "Initial Commit"`;

async function runCommand(command, message) {
  const spinner = ora(message).start();

  try {
    await execAsync(command); // Execute the command asynchronously
    spinner.succeed();
    return true;
  } catch (e) {
    spinner.fail(`Failed to execute ${command}: ${e.toString()}`);
    return false;
  }
}

// if no project name then exit
if (!repoName) {
  console.error(chalk.yellow.bgRed.bold("Please provide a project name."));
  process.exit(-1);
}

// ask for endOption
const endChoice = await inquirer.prompt([
  {
    type: "list",
    name: "type",
    message: "Which end app are you building?",
    choices: endOptions,
  },
]);

// Frontend
if (endChoice.type === endOptions[0]) {
  // ask for frontend option
  const frontendOption = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "Choose a frontend boilerplate option:",
      choices: frontendOptions,
    },
  ]);

  //   Minimal react app (vite + ts + tailwind)
  if (frontendOption.type === frontendOptions[0]) {
    gitCheckOutCommand = `git clone --depth 1 -b ${branchName} https://github.com/laxmanpokhrel/xmanscript-react-app-boilerplate ${repoName}`;
  }

  //   Minimal react app with storybook (vite + ts + tailwind + storybook)
  if (frontendOption.type === frontendOptions[1]) {
    gitCheckOutCommand = `git clone --depth 1 -b ${branchName} https://github.com/laxmanpokhrel/xmanscript-storybook-react-app-boilerplate ${repoName}`;
  }

  //   Minial storybook (vite + ts + storybook)
  if (frontendOption.type === frontendOptions[2]) {
    gitCheckOutCommand = `git clone --depth 1 -b ${branchName} https://github.com/laxmanpokhrel/xmanscript-storybook-boilerplate ${repoName}`;
  }
}

// Backend
if (endChoice.type === endOptions[1]) {
  console.log("Yet to create boilerplate for backend.");
  process.exit(-1);
}

// clone the repo
if (gitCheckOutCommand) {
  const checkOut = await runCommand(gitCheckOutCommand, "Copying files");
  if (!checkOut) process.exit(-1);
}

// install dependencies
const installedDeps = await runCommand(
  installDepsCommand,
  "Installing dependencies"
);
if (!installedDeps) process.exit(-1);

// initialize new .git folder
const initializeGit = await runCommand(
  initializeGitCommand,
  "Initializing project"
);
if (!initializeGit) process.exit(-1);

console.log(
  chalk.cyan.bold(
    "\n-----------------------------------------------------------------------"
  )
);
console.log(
  chalk.white.bold(
    "Successfully Initialised: " + chalk.yellowBright(repoName) + "  🚀"
  )
);
console.log(
  chalk.white.bold(
    "Run: " +
      chalk.yellow(`' cd ${repoName} && npm run dev '`) +
      " to start development server."
  )
);
console.log(
  chalk.cyan.bold(
    "-----------------------------------------------------------------------\n"
  )
);
