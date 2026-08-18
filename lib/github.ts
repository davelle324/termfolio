export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  fork: boolean;
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=20`,
    { headers: { Accept: "application/vnd.github.v3+json" } }
  );
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }
  const repos: GitHubRepo[] = await res.json();
  return repos.filter((r) => !r.fork);
}
