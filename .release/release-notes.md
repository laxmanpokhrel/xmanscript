## Features
- Implemented the ability to automate the creation of releases and deployment of npm packages using a GitHub workflow (flag: `--create-release-action`).
- Added functionality to generate release notes and release configuration files for the action (flag: `--create-release-data`).
- Introduced an independent registry for managing assets.

## Improvements
- Enhanced the package to detect existing projects and decide whether to proceed with execution or terminate.
- Resolved node version dependency issues for versions 18.18.0 and higher.
