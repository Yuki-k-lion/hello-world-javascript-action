import * as core from "@actions/core";
import * as github from "@actions/github";

type ClientType = ReturnType<typeof github.getOctokit>;

export async function run() {
    const repoOwner = github.context.repo.owner;
    const repo = github.context.repo.repo;

    try {
        // `who-to-greet` input defined in action metadata file
        const nameToGreet = core.getInput('who-to-greet');
        console.log(`Hello ${nameToGreet}!`);
        const time = (new Date()).toTimeString();
        core.setOutput("time", time);
        // Get the JSON webhook payload for the event that triggered the workflow
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`);

        const token = core.getInput("repo-token", {required: true});
        const prNumber = getPrNumber();

        if (!prNumber) {
            console.log("pull request number is undefined");
            // エラーにするにのはやりすぎな気がした。
            // throw new Error('pull request number is undefined. this action can run for PR');
            return;
        }

        const client: ClientType = github.getOctokit(token);

        const {data: pullRequest} = await client.rest.pulls.get({
            owner: repoOwner,
            repo: repo,
            pull_number: prNumber,
        });

        core.debug(`fetching changed files for pr #${prNumber}`);

        const changedFiles: string[] = await getChangedFiles(client, prNumber, repo, repoOwner);

        core.debug(`fetching changed files :  #${changedFiles}`);

    } catch (error: any) {
        core.error(error);
        core.setFailed(error.message);
    }
}

function getPrNumber(): number | undefined {
    // const pullRequest = github.context.payload.pull_request;
    return github.context.payload.pull_request?.number ?? undefined;
}


async function getChangedFiles(
    client: ClientType,
    prNumber: number,
    repo: string,
    repoOwner: string
): Promise<string[]> {
    const listFilesOptions = client.rest.pulls.listFiles.endpoint.merge({
        owner: repoOwner,
        repo: repo,
        pull_number: prNumber,
    });

    const listFilesResponse = await client.paginate(listFilesOptions);
    const changedFiles = listFilesResponse.map((f:any) => f.filename);

    core.debug("found changed files:");
    for (const file of changedFiles) {
        core.debug("  " + file);
    }
    return changedFiles;
}