import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LoginInputComponent } from "./login-input.component";
import { LoginInputService } from "../core/index";
import { HttpClient, HttpHandler } from "@angular/common/http";

describe("LoginInputComponent", () => {
    let component: LoginInputComponent;
    let fixture: ComponentFixture<LoginInputComponent>;

    const MockService = jasmine.createSpyObj("LoginInputService", ["service"]);
    const MockHttp = jasmine.createSpyObj("HttpClient", ["http"]);
    const MockHandler = jasmine.createSpyObj("HttpHandler", ["handler"]);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LoginInputComponent],
            providers: [
                {
                    provide: LoginInputService,
                    useValue: MockService
                },
                {
                    provide: HttpClient,
                    useValue: MockHttp
                },
                {
                    provide: HttpHandler,
                    useValue: MockHandler
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
