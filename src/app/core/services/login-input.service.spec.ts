import { TestBed } from "@angular/core/testing";
import { HttpClient } from "@angular/common/http";
import { of, throwError } from "rxjs";

import { LoginInputService } from "./login-input.service";
import { generateQueryAllUsers, generateQueryUser } from "../utils/index";
import { HttpErrorInterceptor } from "./../errors/http-error.interceptor";

describe("LoginInputService", () => {
    let service: LoginInputService;
    const mockHttp: any = jasmine.createSpyObj("HttpClient", ["get"]);
    const mockOuterResponse = {
        items: [
            { login: "fakeLogin" },
            { login: "fakeLogin2" },
            { login: "fakeLogin3" }
        ]
    };
    const mockInnerResponses = {};
    mockOuterResponse.items.forEach((item, index) => {
        mockInnerResponses[generateQueryUser(item.login)] = {
            login: item.login,
            public_repos: index
        };
    });

    const getUsersUrl: string = generateQueryAllUsers("fakeLogin");

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                HttpErrorInterceptor,
                LoginInputService,
                {
                    provide: HttpClient,
                    useValue: mockHttp
                }
            ]
        });

        service = TestBed.get(LoginInputService);
    });

    it("should return array of objects each of which has correct properties (login and publicReposQuantity)", () => {
        mockHttp.get.and.callFake(url => {
            if (url === getUsersUrl) {
                return of(mockOuterResponse);
            } else {
                return of(mockInnerResponses[url]);
            }
        });
        service.getGithubers("fakeLogin").subscribe(githubers => {
            githubers.items.forEach((item, i) => {
                expect(item.login).toBe(mockOuterResponse.items[i].login);
                expect(item.publicReposQuantity).toBe(i);
            });
        });
    });

    it("should ...", () => {
        mockHttp.get.and.callFake(url => {
            if (url.includes("/search/")) {
                console.log("gggggggggggggg");
                return of(mockOuterResponse);
            } else {
                console.log("kkk");
                return throwError({ errorMessage: "PPPPPP" });
            }
        });
        service.getGithubers("error").subscribe(res => {
            console.log(res);
            expect(res).toEqual({
                items: [],
                errorMessage: "PPPPPP"
            });
        });
    });

    it("should ...", () => {
        mockHttp.get.and.callFake(url => {
            return of({ items: [], error: true, errorMessage: "PPPPPP" });
        });

        service.getGithubers("error").subscribe(res => {
            console.log("res", res);
            expect(res).toEqual({
                items: [],
                error: true,
                errorMessage: "PPPPPP"
            });
        });
    });
});
