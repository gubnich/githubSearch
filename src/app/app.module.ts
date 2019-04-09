import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { LoginInputComponent } from "./login-input/login-input.component";
import { LoginInputService } from "./core/services/index";

@NgModule({
    declarations: [AppComponent, LoginInputComponent],
    imports: [BrowserModule, HttpClientModule],
    providers: [LoginInputService],
    bootstrap: [AppComponent]
})
export class AppModule {}
