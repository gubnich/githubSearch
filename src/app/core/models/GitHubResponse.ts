interface Login {
    login: string;
}

interface Error {
    error?: boolean;
    errorMessage?: string;
}

export interface GithubUsers extends Error {
    items: Array<Login>;
}

export interface GithubResponse extends Error {
    login: string;
    public_repos: number;
}

export interface GithubLoginAndRepos extends Error {
    login: string;
    publicReposQuantity: number;
}
