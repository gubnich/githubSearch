import { githubToken } from "./../../../app.config";

export function generateQueryAllUsers(
    query: string,
    token: string = githubToken
): string {
    return `https://api.github.com/search/users?access_token=${token}&page=1&per_page=7&q=${query}in:login`;
}
