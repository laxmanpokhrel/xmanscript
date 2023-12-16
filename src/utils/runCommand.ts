import { exec } from "child_process";
import ora from "ora";
import * as util from "util";

const execAsync = util.promisify(exec);

export default async function runCommand(command, message) {
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
