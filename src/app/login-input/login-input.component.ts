import {
    Component,
    ViewChild,
    ElementRef,
    OnInit,
    ChangeDetectionStrategy
} from "@angular/core";

import { fromEvent, Observable } from "rxjs";
import {
    switchMap,
    debounceTime,
    publishReplay,
    refCount
} from "rxjs/operators";

import { LoginInputService, GithubLoginAndRepos } from "../core/index";
import { timeBetweenKeyups } from "./login-input.constants";

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

    public ngOnInit() {
        this.input$ = fromEvent(this.input.nativeElement, "input");
        this.githubers$ = this.input$.pipe(
            debounceTime(timeBetweenKeyups),
            switchMap(() =>
                this.loginInputService.getGithubers(
                    this.input.nativeElement.value
                )
            ),
            publishReplay(1),
            refCount()
        );
    }

    /**
     *  This method is to help Angular to track which items added
     */
    public trackByLogin(index, item) {
        return item.login;
    }

    /**
     *  To change current li-element via keyboard (handles arrow-down event)
     */
    public down(): void {
        //  IF it`s not the first keyup event and we already have the picked by user li-element
        //  we change style of this active element and assign the next element as active (it may be
        //  either the next sibling or the first li-element by circle).
        if (this.active) {
            this.active.style.background = "transparent";
            this.active =
                this.active.nextSibling ||
                this.list.nativeElement.firstElementChild;
            //  ELSE if it`s the first keyup event we don`t have an active element yet and
            //  we must assign to it the first li-element
        } else {
            this.active = this.list.nativeElement.firstElementChild;
        }
        //  Also if the list of autocomplete options is not empty we change the style of active
        //  li-element in response to every key event and pass the value of this element into the html-input
        if (this.list.nativeElement.children.length) {
            this.active.style.background = "pink";
            this.input.nativeElement.value = this.active.firstElementChild.textContent;
        }
    }

    /**
     *  To change current li-element via keyboard (handles arrow-up event)
     */
    public up(): void {
        //  IF it`s not the first keyup event and we already have the picked by user li-element
        //  we change style of this active element and assign the next element as active (it may be
        //  either the previous sibling or the last li-element by circle).
        if (this.active) {
            this.active.style.background = "transparent";
            this.active =
                this.active.previousSibling &&
                this.active.previousSibling.nodeName === "LI"
                    ? this.active.previousSibling
                    : this.list.nativeElement.lastElementChild;
            //  ELSE if it`s the first keyup event we don`t have an active element yet and
            //  we must assign to it the last li-element
        } else {
            this.active = this.list.nativeElement.lastElementChild;
        }
        //  Also if the list of autocomplete options is not empty we change the style of new active
        //  li-element in response to every key event and pass the value of this element into the html-input
        if (this.list.nativeElement.children.length) {
            this.active.style.background = "pink";
            this.input.nativeElement.value = this.active.firstElementChild.textContent;
        }
    }
}
