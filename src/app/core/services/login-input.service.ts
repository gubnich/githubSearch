import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { from, Observable } from "rxjs";
import { map, mergeMap, switchMap, scan, tap } from "rxjs/operators";

import {
    GithubUsers,
    GithubLoginAndRepos,
    GithubResponse
} from "../models/index";
import { generateQueryAllUsers, generateQueryUser } from "../utils/index";

@Injectable()
export class LoginInputService {
    private http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    /**
     *  Get array of user info from GitHub API via Http-client
     */
    public getGithubers(query: string): Observable<Array<GithubLoginAndRepos>> {
        return this.http.get(generateQueryAllUsers(query)).pipe(
            switchMap((res: GithubUsers) =>
                from(res.items.map(item => item.login)).pipe(
                    mergeMap(githubLogin => this.getRepos(githubLogin)),
                    scan(
                        (githubers, nextGithuber: GithubLoginAndRepos) => [
                            ...githubers,
                            nextGithuber
                        ],
                        []
                    )
                )
            )
        );
    }

    /**
     *  Get quantity of repos for particular user from GitHub API
     */
    public getRepos(githubLogin: string): Observable<GithubLoginAndRepos> {
        return this.http.get(generateQueryUser(githubLogin)).pipe(
            map(
                ({
                    login,
                    public_repos: publicReposQuantity
                }: GithubResponse) => ({
                    login,
                    publicReposQuantity
                })
            )
        );
    }
}
