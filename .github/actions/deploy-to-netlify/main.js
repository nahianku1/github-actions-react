const core = require("@actions/core");
const { exec } = require("child_process");

async function run() {
  try {
    // Get inputs from the action metadata
    const authToken = core.getInput("auth_token");
    const buildDir = core.getInput("build_directory") || "dist";

    // Set environment variables for Netlify CLI
    process.env.NETLIFY_AUTH_TOKEN = authToken;

    // Function to execute shell commands
    const execCommand = (cmd) => {
      return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else if (stderr) {
            console.error(stderr);
            resolve(stdout);
          } else {
            resolve(stdout);
          }
        });
      });
    };

    // Run multiple commands sequentially using '&&'
    const combinedCommands = `
    npx netlify sites:create || true &&
    npx netlify deploy --dir=${buildDir} --prod
    `;

    console.log("Running deployment commands...");
    const output = await execCommand(combinedCommands);
    console.log(output);

    console.log("Deployment to Netlify was successful.");
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
