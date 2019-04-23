import { TestBed, async } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { LoginInputComponent } from "./login-input/login-input.component";
import { LoginInputService } from "./core";
import { HttpClient, HttpHandler } from "@angular/common/http";

const MockService = jasmine.createSpyObj("LoginInputService", ["service"]);
const MockHttp = jasmine.createSpyObj("HttpClient", ["http"]);
const MockHandler = jasmine.createSpyObj("HttpHandler", ["handler"]);

describe("AppComponent", () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent, LoginInputComponent],
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

    it("should create the app", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title 'githubSearch'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual("githubSearch");
    });
});
