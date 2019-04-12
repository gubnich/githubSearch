import { githubToken } from "./../../../app.config";

export function generateQueryUser(
    githubLogin: string,
    token: string = githubToken
): string {
    return `https://api.github.com/users/${githubLogin}?access_token=${token}`;
}
