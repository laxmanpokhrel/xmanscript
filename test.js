import * as https from "https";
// Define the repository details
const owner = "laxmanpokhrel";
const repo = "xmanscript";
const branch = "main";
const filePath = "registry/release.sh";

// Construct the URL for the raw content of the file
const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;

// Make a GET request to the URL
https
  .get(url, (response) => {
    let data = "";

    // A chunk of data has been received
    response.on("data", (chunk) => {
      data += chunk;
    });

    // The whole response has been received
    response.on("end", () => {
      console.log(data);
    });
  })
  .on("error", (error) => {
    console.error("Error:", error.message);
  });
