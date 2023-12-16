import { availableFlags } from "@/constants";
import chalk from "chalk";

export default function showAvailableFlags() {
  availableFlags.forEach(({ name, description }) => {
    console.log(chalk.white(name) + ": " + chalk.yellow(description));
  });
}
