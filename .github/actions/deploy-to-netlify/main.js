const core = require("@actions/core");
const { exec } = require("@actions/exec");

async function run() {
  try {
    // Get inputs from the action metadata
    const authToken = core.getInput("auth_token");
    const buildDir = core.getInput("build_directory");
    const siteName = core.getInput("site_name");

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

     // Install Dependencies
     console.log("Installing Dependencies...");
     await execCommand(`npm cli`);
 
     // Building artifacts
     console.log("Building artifacts...");
     const createSiteOutput = await execCommand(`npm run build`);
     console.log(createSiteOutput);

    // Deploy to Netlify
    console.log("Running deployment commands...");
    const deployOutput = await execCommand(
      `netlify deploy --dir=${buildDir} --site=${siteName} --prod`
    );
    console.log(deployOutput);

    console.log("Deployment to Netlify was successful.");
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
