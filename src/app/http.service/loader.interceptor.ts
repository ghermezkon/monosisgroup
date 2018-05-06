import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoaderService } from './LoaderService';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    //------------------------------------------------------------------------------
    constructor(private _loader: LoaderService){}
    //------------------------------------------------------------------------------
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this._loader.show();
        return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                this._loader.hide();
            }
        }));
    }
}