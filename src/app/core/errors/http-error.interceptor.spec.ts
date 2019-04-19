import { throwError } from "rxjs";

import { HttpErrorInterceptor } from "./http-error.interceptor";
import { generateQueryAllUsers, generateQueryUser } from "../utils/index";

describe(`HttpErrorInterceptor`, () => {
    let errorInterceptor;
    let serviceSpy;
    beforeEach(() => {
        serviceSpy = jasmine.createSpyObj("LoginInputService", ["http"]);
        errorInterceptor = new HttpErrorInterceptor();
    });

    it("should ", () => {
        const url = generateQueryAllUsers("test");
        const httpHandlerSpy = jasmine.createSpyObj("HttpHandler", ["handle"]);

        httpHandlerSpy.handle.and.returnValue(
            throwError({ error: { message: "test-error" } })
        );

        errorInterceptor
            .intercept({ url }, httpHandlerSpy)
            .subscribe(undefined, err => {
                expect(err.errorMessage).toBe(
                    "Can't get users by login: test-error"
                );
            });
    });

    it("should ", () => {
        const url = generateQueryUser("test");
        const httpHandlerSpy = jasmine.createSpyObj("HttpHandler", ["handle"]);

        httpHandlerSpy.handle.and.returnValue(
            throwError({ error: { message: "test-error" } })
        );

        errorInterceptor
            .intercept({ url }, httpHandlerSpy)
            .subscribe(undefined, err => {
                expect(err.errorMessage).toBe(
                    "Can't get particular user: test-error"
                );
            });
    });
});
