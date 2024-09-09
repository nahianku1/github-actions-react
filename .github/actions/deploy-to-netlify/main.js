const core = require("@actions/core");
const { exec } = require("child_process");

async function run() {
  try {
    // Get inputs from the action metadata
    const authToken = core.getInput("auth_token");
    const buildDir = core.getInput("build_directory");
    const siteName = core.getInput("site_name");
    const team = core.getInput("team");

    // Set environment variables for Netlify CLI
    process.env.NETLIFY_AUTH_TOKEN = authToken;

    // Function to execute shell commands
    const execCommand = (cmd) => {
      return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            reject(error);
          } else {
            if (stderr) {
              console.warn(`Warning: ${stderr}`);
            }
            resolve(stdout);
          }
        });
      });
    };

    try {
      await execCommand(
        `npx netlify sites:create --team=${team} --name=${siteName}`
      );
    } catch (siteError) {
      console.log("Site does not exist. Creating a new site...");
    }

    // Deploy to Netlify
    console.log("Running deployment commands...");
    const deployOutput = await execCommand(
      `npx netlify deploy --dir=${buildDir} --auth $NETLIFY_AUTH_TOKEN --site=${siteName} --prod`
    );
    console.log(deployOutput);

    console.log("Deployment to Netlify was successful.");
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
