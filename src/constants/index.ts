import * as path from "path";

export const scriptChoices = ["Frontend", "Backend"];

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

export const availableFlags = [
  { name: "--frontend", description: "Create frontend app" },
  { name: "--backend", description: "Create backend app" },
  { name: "--help", description: "List all flags" },
];

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
