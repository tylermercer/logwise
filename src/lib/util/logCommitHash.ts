import { PUBLIC_COMMIT_HASH } from "$env/static/public";

export default function logCommitHash() {
    console.log(`Version: ${PUBLIC_COMMIT_HASH}`)
}