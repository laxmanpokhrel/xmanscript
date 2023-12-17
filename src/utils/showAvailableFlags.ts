import chalk from "chalk";
import { availableFlags } from "@/src/constants";

export default function showAvailableFlags() {
  availableFlags.forEach(({ name, description }) => {
    console.log(chalk.white(name) + ": " + chalk.yellow(description));
  });
}
