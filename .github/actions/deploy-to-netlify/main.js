const core = require("@actions/core");
const { exec } = require("@actions/exec");
const { getOctokit, context } = require("@actions/github");

async function run() {
    const token = core.getInput("token");

    const octokit = getOctokit(token);

    const { actor, repo } = context;

    console.log({actor, repo});

   
}

run();
