import {
    Component,
    ViewChild,
    ElementRef,
    OnInit,
    ChangeDetectionStrategy
} from "@angular/core";

import { fromEvent, Observable } from "rxjs";
import { switchMap, debounceTime } from "rxjs/operators";

import { LoginInputService, GithubLoginAndRepos } from "../core/index";

@Component({
    selector: "app-login-input",
    templateUrl: "./login-input.component.html",
    styleUrls: ["./login-input.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginInputComponent implements OnInit {
    /**
     *  Service to get data from GitHub
     */
    private loginInputService: LoginInputService;

    /**
     *  User's input
     */
    public input$: Observable<string>;

    /**
     *  Stores the list of github users with corresponding amount of repos
     */
    public githubers$: Observable<Array<GithubLoginAndRepos>>;

    /**
     *  Currently picked li-element
     */
    public active: HTMLLIElement;

    /**
     *  Ref to hmtl-input-element
     */
    @ViewChild("input") input: ElementRef;

    /**
     *  Ref to html-ul-element
     */
    @ViewChild("list") list: ElementRef;

    constructor(loginInputService: LoginInputService) {
        this.loginInputService = loginInputService;
    }

    ngOnInit() {
        this.input$ = fromEvent(this.input.nativeElement, "input");
        this.githubers$ = this.input$.pipe(
            debounceTime(500),
            switchMap(() =>
                this.loginInputService.getGithubers(
                    this.input.nativeElement.value
                )
            )
        );
    }

    /**
     *  This method is to help Angular to track which items added
     */
    public trackById(index, item) {
        return item.id;
    }

    /**
     *  To change current li-element via keyboard (handles arrow-down event)
     */
    down(): void {
        if (this.active) {
            this.active.style.background = "transparent";
            this.active =
                this.active.nextSibling ||
                this.list.nativeElement.firstElementChild;
        } else {
            this.active = this.list.nativeElement.firstElementChild;
        }
        if (this.list.nativeElement.children.length) {
            this.active.style.background = "pink";
            this.input.nativeElement.value = this.active.firstElementChild.textContent;
        }
    }

    /**
     *  To change current li-element via keyboard (handles arrow-up event)
     */
    up(): void {
        if (this.active) {
            this.active.style.background = "transparent";
            this.active =
                this.active.previousSibling &&
                this.active.previousSibling.nodeName === "LI"
                    ? this.active.previousSibling
                    : this.list.nativeElement.lastElementChild;
        } else {
            this.active = this.list.nativeElement.lastElementChild;
        }
        if (this.list.nativeElement.children.length) {
            this.active.style.background = "pink";
            this.input.nativeElement.value = this.active.firstElementChild.textContent;
        }
    }
}
