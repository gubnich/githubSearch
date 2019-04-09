import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";

import { ajax } from "rxjs/ajax";
import { map, switchMap, tap, debounceTime } from "rxjs/operators";
import { fromEvent } from "rxjs";
import { LoginInputService } from "../core/index";
import { GitHubResponse } from "./../core/index";

@Component({
    selector: "app-login-input",
    templateUrl: "./login-input.component.html",
    styleUrls: ["./login-input.component.scss"]
})
export class LoginInputComponent implements OnInit {
    private loginInputService: LoginInputService;
    public input$;
    public logins$;
    @ViewChild("input") input: ElementRef;
    @ViewChild("list") list: ElementRef;

    constructor(loginInputService: LoginInputService) {
        this.loginInputService = loginInputService;
    }

    ngOnInit() {
        this.input$ = fromEvent(this.input.nativeElement, "input");
        this.logins$ = this.input$.pipe(
            debounceTime(500),
            switchMap(() =>
                this.loginInputService.getGithubLogins(
                    this.input.nativeElement.value
                )
            ),
            map((res: GitHubResponse) => res.items.map(item => item.login))
        );
    }
    public logins;
    public active;
    onEnter(value) {
        const obs$ = ajax(
            `https://api.github.com/search/users?access_token=7eb93314917f06ba24957f7426e9c7236f35a952&page=1&per_page=1&q=${value}in:login`
        );
        obs$.subscribe(res => {
            console.log(res.status, res.response);
            this.logins = this.getLogins(res.response.items);
            console.log(this.logins);
            this.logins.forEach(element => {
                console.log(element);
                const repos$ = ajax(`https://api.github.com/users/${element}`);
                repos$.subscribe(respond => {
                    console.log(respond.status, respond.response);
                });
            });
        });
    }
    getLogins(githubResponse) {
        return githubResponse.map(item => item.login);
    }
    getRepos(user) {
        console.log(user);
    }
    children() {
        if (this.active) {
            this.active.style.background = "transparent";
            this.active =
                this.active.nextSibling || this.list.nativeElement.children[0];
        } else {
            this.active = this.list.nativeElement.children[0];
        }
        this.active.style.background = "red";
    }
}
