import ora from "ora";
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { __dirname } from "@/src/constants";
import getGitAuthor from "@/src/utils/getGitAuthor";

export default async function configurePackageJson(repoName: string) {
  const spinner = ora("Configuring package.json").start();

  fs.readFile(
    path.resolve(`./${repoName}/package.json`),
    "utf-8",
    async (error, data) => {
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
        path.resolve(`./${repoName}/package.json`),
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
    }
  );
}
