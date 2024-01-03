import inquirer from "inquirer";

export default async function getRepoName() {
  return await inquirer.prompt([
    {
      name: "repoName",
      type: "input",
      message: "Project name: ",
    },
  ]);
}
