import * as fs from "fs";

function fileExists(filePath: string): boolean {
  try {
    // Check if the file exists
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    // File does not exist or other error occurred
    return false;
  }
}
export default fileExists;
