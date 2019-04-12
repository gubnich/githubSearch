import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { LoginInputComponent } from "./login-input/login-input.component";
import { LoginInputService } from "./core/services/index";
import { HttpErrorInterceptor } from "./core/errors/http-error.interceptor";

@NgModule({
    declarations: [AppComponent, LoginInputComponent],
    imports: [BrowserModule, HttpClientModule],
    bootstrap: [AppComponent],
    providers: [
        LoginInputService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        }
    ]
})
export class AppModule {}
