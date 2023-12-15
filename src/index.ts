#! /usr/bin/env node

import inquirer from "inquirer";
import ora from "ora";
import util from "util";
import { exec } from "child_process";
import chalk from "chalk";
import fs from "fs";

const execAsync = util.promisify(exec);

/* Constants */
const endOptions = ["Frontend", "Backend"];
const frontendOptions: Record<string, string>[] = [
  {
    name: "Minimal react app (vite + ts + tailwind)",
    repo: "https://github.com/laxmanpokhrel/xmanscript-react-app-boilerplate",
  },
  {
    name: "Minimal react app with storybook (vite + ts + tailwind + storybook)",
    repo: "https://github.com/laxmanpokhrel/xmanscript-storybook-react-app-boilerplate",
  },
  {
    name: "Minial storybook (vite + ts + storybook)",
    repo: "https://github.com/laxmanpokhrel/xmanscript-storybook-boilerplate",
  },
];

const availableFlags = [
  { name: "--frontend", description: "Create frontend app" },
  { name: "--backend", description: "Create backend app" },
  { name: "--help", description: "List all flags" },
];

/* Constants end */

/* Utils */
// Extracting flags from process.argv
function extractFlags() {
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith("--")) {
      const flag = arg.slice(2);
      if (
        i + 1 < process.argv.length &&
        !process.argv[i + 1].startsWith("--")
      ) {
        flags[flag] = process.argv[i + 1];
        i++; // Skip the flag argument value
      } else {
        flags[flag] = true; // Flag without a value
      }
    }
  }
  return flags;
}

// Get the repo name
async function getRepoName() {
  return await inquirer.prompt([
    {
      name: "repoName",
      type: "input",
      message: "Project name: ",
    },
  ]);
}

// Run command
async function runCommand(command, message) {
  const spinner = ora(message).start();
  try {
    await execAsync(command);
    spinner.succeed();
    return true;
  } catch (e) {
    spinner.fail(`Failed to execute ${command}: ${e.toString()}`);
    return false;
  }
}

function showAvailableFlags() {
  availableFlags.forEach(({ name, description }) => {
    console.log(chalk.white(name) + ": " + chalk.yellow(description));
  });
}
async function getGitAuthor() {
  const spinner = ora("Reading git config ").start();

  try {
    const author = await execAsync("git config user.name");
    spinner.succeed();
    return author.stdout.slice(0, author.stdout.length - 1);
  } catch (e) {
    spinner.fail("Failed to read git config. Please set the git config.");
    process.exit(-1);
  }
}

async function configurePackageJson(repoName) {
  const spinner = ora("Configuring package.json").start();

  fs.readFile(`./${repoName}/package.json`, "utf-8", async (error, data) => {
    if (error) {
      spinner.fail(`${chalk.red("Error reading package.json")}: ${error}`);
      process.exit(-1);
    }
    const packageJson = JSON.parse(data);

    // Get git author
    const author = await getGitAuthor();
    packageJson.name = repoName;
    packageJson.author = author;
    const updatedPackageJson = JSON.stringify(packageJson, null, 2);

    // Write the updated content back to package.json
    fs.writeFile(
      `./${repoName}/package.json`,
      updatedPackageJson,
      "utf8",
      (err) => {
        if (err) {
          console.error(chalk.red("Error writing file: "), err);
          spinner.fail();
          process.exit(-1);
        }
        spinner.succeed();
      }
    );
  });
}

/* Utils end */

// Frontend
async function frontend() {
  const branchName = "main";

  // ask for frontend option
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
    process.exit(-1);
  }

  // Create checkout command
  const gitCheckOutCommand = `git clone --depth 1 -b ${branchName} ${
    frontendOptions.find((item) => item.name === frontendOption.type).repo
  } ${repoName}`;

  // Clone the repo
  if (gitCheckOutCommand) {
    const checkOut = await runCommand(gitCheckOutCommand, "Copying files");
    if (!checkOut) process.exit(-1);
  }

  // Configure the package.json name
  await configurePackageJson(repoName);

  // Install dependencies
  const installedDeps = await runCommand(
    `cd ${repoName} && npm i`,
    "Installing dependencies"
  );
  if (!installedDeps) process.exit(-1);

  // Initialize new .git folder
  const initializeGit = await runCommand(
    `cd ${repoName} && rm -rf .git && git init && git branch -M main && git add . && git commit -m "Initial Commit"`,
    "Initializing project"
  );
  if (!initializeGit) process.exit(-1);

  // Success message
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
}

// Backend
async function backend() {
  console.log("Yet to create boilerplate for backend.");
}

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
    // Ask for endOption
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
      await frontend();
    }
    // Backend
    if (endChoice.type === endOptions[1]) {
      await backend();
    }
  }
}
main();
