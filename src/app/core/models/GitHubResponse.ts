interface Login {
    login: string;
}

export interface GithubUsers {
    items: Array<Login>;
}

export interface GithubResponse {
    login: string;
    public_repos: number;
}

export interface GithubLoginAndRepos {
    login: string;
    publicReposQuantity: number;
}
