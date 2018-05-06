import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalHttpService } from './global.http.service';

import * as moment from "moment";
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private loggedIn = new BehaviorSubject<boolean>(false);
    private loginError = new BehaviorSubject<string>('');
    //------------------------------------------------------
    constructor(private router: Router, private _http: GlobalHttpService) { }
    //------------------------------------------------------
    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }
    get isLoginError() {
        return this.loginError.asObservable();
    }
    //------------------------------------------------------
    login(username?: any, password?: any) {
        this._http.get_teacher_for_login(username, password).pipe(take(1)).subscribe((res: any) => {
            if (res == 'Unauthorized') {
                this.loggedIn.next(false);
                this.loginError.next('نام کاربری یا رمز عبور اشتباه است');
            } else {
                const expiresAt = moment().add(res.value.expiresIn, 'second');
                localStorage.setItem('id_token', res.idToken);
                localStorage.setItem('user_data', res.value);
                localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
                this.loggedIn.next(true);
                this.router.navigate(['/']);
            }
        })
    }
    public checkLoginStatus() {
        return moment().isBefore(this.getExpiration());
    }
    public checkLogoutStatus() {
        return !this.checkLoginStatus();
    }
    //------------------------------------------------------
    logout() {
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
        this.loggedIn.next(false);
        this.loginError.next('');
        this.router.navigate(['/login']);
    }
    getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }
}