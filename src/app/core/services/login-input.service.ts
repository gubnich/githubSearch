import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { from, Observable } from "rxjs";

import { GithubUsers, GithubLoginAndRepos } from "../models/index";
import { map, mergeMap, switchMap, scan } from "rxjs/operators";

@Injectable()
export class LoginInputService {
    private http: HttpClient;
    constructor(http: HttpClient) {
        this.http = http;
    }

    /**
     *  Get information from GitHub API via Http-client
     */
    getGithubers(query: string): Observable<Array<GithubLoginAndRepos>> {
        /**
         *  Personal token, required by GitHub API
         */
        const token = "7eb93314917f06ba24957f7426e9c7236f35a952";

        /**
         *  Query string template
         */
        const getStr = `https://api.github.com/search/users?access_token=${token}&page=1&per_page=7&q=${query}in:login`;

        return this.http.get(getStr).pipe(
            switchMap((res: GithubUsers) =>
                from(res.items.map(item => item.login)).pipe(
                    mergeMap(githubLogin =>
                        this.http
                            .get(
                                `https://api.github.com/users/${githubLogin}?access_token=${token}`
                            )
                            .pipe(
                                map(
                                    ({
                                        login,
                                        public_repos
                                    }: GithubLoginAndRepos) => ({
                                        login,
                                        repos: public_repos
                                    })
                                )
                            )
                    ),
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
}
