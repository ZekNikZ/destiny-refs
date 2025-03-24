import { useGlobalData } from "../data/useGlobalData";

export function checkForUpdates() {
  useGlobalData.getState().checkForUpdates();
}

export async function getLatestCommitHash(owner: string, repo: string, branch: string = "main") {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data.sha; // Latest commit hash
  } catch (error) {
    console.error("Error fetching latest commit hash:", error);
  }
}
