import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { GitHubResponse } from "../models/index";

@Injectable()
export class LoginInputService {
    private http: HttpClient;
    constructor(http: HttpClient) {
        this.http = http;
    }
    getGithubLogins(query): Observable<GitHubResponse> {
        const token = "7eb93314917f06ba24957f7426e9c7236f35a952";
        const get = `https://api.github.com/search/users?access_token=${token}&page=1&per_page=7&q=${query}in:login`;

        return this.http.get(get) as Observable<GitHubResponse>;
    }
}
