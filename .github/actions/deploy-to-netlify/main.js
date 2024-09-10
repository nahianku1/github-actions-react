const core = require("@actions/core");
const { exec } = require("@actions/exec");

async function run() {
  try {
    const authToken = core.getInput("auth_token");
    const siteName = core.getInput("site_name");

    process.env.NETLIFY_AUTH_TOKEN = authToken;

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

    // Deploy to Netlify
    console.log("Deploying to Netlify...");
    const deployOutput = await execCommand(
      `npm ci && npm run build && npx netlify deploy --dir=dist --site=${siteName} --prod`
    );
    console.log(deployOutput);

    console.log("Deployment to Netlify was successful.");
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
