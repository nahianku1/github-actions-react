const core = require("@actions/core");
const { exec } = require("@actions/exec");
const { getOctokit, context } = require("@actions/github");

async function run() {
  const token = core.getInput("token");

  const octokit = getOctokit(token);

  const {
    repo: { owner, repo },
  } = context;

  console.log({ owner, repo });

  exec(`npm ci && npm run build`, (err, stdout, stderr) => {
    if (err) {
      core.setFailed(err.message);
    } else if (stderr) {
      console.log(stderr);
    } else {
      console.log(stdout);
    }
  });
}

run();
