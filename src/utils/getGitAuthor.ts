import ora from "ora";
import * as util from "util";
import { exec } from "child_process";

const execAsync = util.promisify(exec);

export default async function getGitAuthor() {
  const spinner = ora("Reading git config ").start();

  try {
    const author = await execAsync("git config user.name");
    spinner.succeed();
    return author.stdout.slice(0, author.stdout.length - 1);
  } catch (e) {
    spinner.fail("Failed to read git config. Please set the git config.");
    process.exit(1);
  }
}
