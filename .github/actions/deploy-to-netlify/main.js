const core = require("@actions/core");
const { exec } = require("@actions/exec");

async function run() {
  try {
    const authToken = core.getInput("auth_token");
    const siteName = core.getInput("site_name");

    process.env.NETLIFY_AUTH_TOKEN = authToken;

    exec(
      `npm ci && npm run build && npx netlify deploy --dir=dist --site=${siteName} --prod`
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
