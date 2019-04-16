import { Injectable } from "@angular/core";
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse
} from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";

/**
 *  This substr differentiate one query-string from another
 */
const differentiationString = "/search/";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    intercept(
        request: HttpRequest<string>,
        next: HttpHandler
    ): Observable<HttpEvent<HttpErrorResponse>> {
        return next.handle(request).pipe(
            retry(1),
            catchError((error: HttpErrorResponse) => {
                let errorMessage = "";
                if (request.url.includes(differentiationString)) {
                    errorMessage = `Can't get users by login: ${
                        error.error.message
                    }`;
                } else {
                    errorMessage = `Can't get particular user: ${
                        error.error.message
                    }`;
                }
                return throwError({ error: true, errorMessage });
            })
        );
    }
}
