import { TestBed } from "@angular/core/testing";

import { LoginInputService } from "./login-input.service";

describe("LoginInputService", () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it("should be created", () => {
        const service: LoginInputService = TestBed.get(LoginInputService);
        expect(service).toBeTruthy();
    });
});
