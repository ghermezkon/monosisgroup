import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { AuthService } from './AuthService';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authService.isLoggedIn
            .take(1)
            .map((isLoggedIn: boolean) => {
                if (!isLoggedIn) {
                    this.router.navigate(['/login']);
                    return false;
                }
                return true;
            });
    }
    canLoad(route: Route): Observable<boolean> {
        return this.authService.isLoggedIn
            .take(1)
            .map((isLoggedIn: boolean) => {
                if (!isLoggedIn) {
                    this.router.navigate(['/login']);
                    return false;
                }
                return true;
            });
    }
}
