import * as https from "https";

function fetchFileContent(
  owner: string,
  repo: string,
  branch: string,
  filePath: string
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
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
          resolve(data);
        });
      })
      .on("error", (error) => {
        reject(new Error(`Error fetching file content: ${error.message}`));
      });
  });
}

// Usage example
const owner = "laxmanpokhrel";
const repo = "xmanscript";
const branch = "main";
const filePath = "registry/release.sh";

fetchFileContent(owner, repo, branch, filePath)
  .then((data) => {
    console.log(data); // Do something with the fetched data
  })
  .catch((error) => {
    console.error(error);
  });
