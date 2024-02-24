import { fileURLToPath } from "url";
import * as path from "path";

export const starterChoice = [
  "Bolierplates",
  "Setup github action to deploy npm package",
  "Create package release data",
];

export const frontendOptions: Record<string, string>[] = [
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
  {
    name: "Npm Package Starter Kit",
    repo: "https://github.com/laxmanpokhrel/xmanscript-npm-package-boilerplate",
  },
];

export const boilerplatesChoices = ["Frontend", "Backend"];

export const availableFlags = [
  { name: "--frontend", description: "Create frontend app" },
  { name: "--backend", description: "Create backend app" },
  {
    name: "--create-release",
    description:
      "Create release and tag to deploy your package to npm or to trigger the release workflow create by the cli",
  },
  {
    name: "--create-release-workflow",
    description: "Create release workflow to deploy package to npm",
  },
  { name: "--help", description: "List all flags" },
];

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
