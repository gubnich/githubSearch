import { TestBed } from "@angular/core/testing";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";

import { LoginInputService } from "./login-input.service";
import { generateQueryAllUsers, generateQueryUser } from "../utils/index";

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
                LoginInputService,
                {
                    provide: HttpClient,
                    useValue: mockHttp
                }
            ]
        });

        service = TestBed.get(LoginInputService);
    });

    it("should return array of logins (array of objects with logins)", () => {
        mockHttp.get.and.callFake(url => {
            if (url === getUsersUrl) {
                return of(mockOuterResponse);
            } else {
                return of(mockInnerResponses[url]);
            }
        });
        service.getGithubers("fakeLogin").subscribe(githubers => {
            githubers.items.forEach((item, i) => {
                expect(item.publicReposQuantity).toBe(i);
            });
        });
    });
});
