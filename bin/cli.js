#! /usr/bin/env node

import { execSync } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";

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
let installDepsCommand = undefined;
let initializeGitCommand = `cd ${repoName} && rm -rf .git && git init`;
let setMainBranchCommand = `cd ${repoName} && git branch -M main`;
let firstGitCommitCommand = `cd ${repoName} && git add . && git commit -m "Initial Commit"`;

function runCommand(command) {
  try {
    execSync(`${command}`, { stdio: "inherit" });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
  return true;
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
    installDepsCommand = `cd ${repoName} && yarn`;
  }

  //   Minimal react app with storybook (vite + ts + tailwind + storybook)
  if (frontendOption.type === frontendOptions[1]) {
    gitCheckOutCommand = `git clone --depth 1 -b ${branchName} https://github.com/laxmanpokhrel/xmanscript-storybook-react-app-boilerplate ${repoName}`;
    installDepsCommand = `cd ${repoName} && yarn`;
  }

  //   Minial storybook (vite + ts + storybook)
  if (frontendOption.type === frontendOptions[2]) {
    gitCheckOutCommand = `git clone --depth 1 -b ${branchName} https://github.com/laxmanpokhrel/xmanscript-storybook-boilerplate ${repoName}`;
    installDepsCommand = `cd ${repoName} && yarn`;
  }
}

// Backend
if (endChoice.type === endOptions[1]) {
  console.log("Yet to create boilerplate for backend.");
  process.exit(-1);
}

// clone the repo
if (gitCheckOutCommand) {
  console.log("Cloning in the repo...");
  const checkOut = runCommand(gitCheckOutCommand);
  if (!checkOut) process.exit(-1);
}

// install dependencies
console.log(chalk.bgGreen.white.bold("Installing dependencies..."));
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) process.exit(-1);

// initialize new .git folder
console.log(chalk.bgGreen.white.bold("Initializing git..."));
const initializeGit = runCommand(initializeGitCommand);
if (!initializeGit) process.exit(-1);

// setup main branch to `main`
console.log(chalk.bgGreen.white.bold("Setting up main branch..."));
const setMainBranch = runCommand(setMainBranchCommand);
if (!setMainBranch) process.exit(-1);

// make first commit
console.log(chalk.bgGreen.white.bold("Making initial commit..."));
const firstGitCommit = runCommand(firstGitCommitCommand);
if (!firstGitCommit) process.exit(-1);

console.log("success!!");
