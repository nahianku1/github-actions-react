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

  exec(`pwd && ls -la && npm ci && npm run build`);
}

run();
