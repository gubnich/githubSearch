import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { from, Observable, of, throwError } from "rxjs";
import { map, mergeMap, switchMap, scan, catchError } from "rxjs/operators";

import {
    GithubLoginAndRepos,
    GithubResponse,
    GithubUsers
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
            switchMap((res: GithubUsers) => {
                if (res.error) {
                    return of(res);
                } else {
                    return from(res.items.map(item => item.login)).pipe(
                        mergeMap((githubLogin: string) =>
                            this.getRepos(githubLogin)
                        ),
                        scan(
                            (githubers, nextGithuber: GithubLoginAndRepos) => [
                                ...githubers,
                                nextGithuber
                            ],
                            []
                        ),
                        map(githubers => {
                            return { items: githubers };
                        }),
                        catchError(err => of({ items: [], ...err }))
                    );
                }
            }),
            catchError(err => of({ items: [], ...err }))
        );
    }

    /**
     *  Get quantity of repos for particular user from GitHub API
     */
    private getRepos(githubLogin: string): Observable<GithubLoginAndRepos> {
        return this.http.get(generateQueryUser(githubLogin)).pipe(
            map(
                ({
                    login,
                    public_repos: publicReposQuantity
                }: GithubResponse) => ({
                    login,
                    publicReposQuantity
                })
            ),
            catchError(err => throwError(err))
        );
    }
}
