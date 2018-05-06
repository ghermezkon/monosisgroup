import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { GlobalHttpService } from './global.http.service';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResolverSchoolService implements Resolve<Observable<any>> {

    constructor(private _http: GlobalHttpService) { }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._http.get_all_school();
    }
}
//----------------------------------------------------------------------------------------------
@Injectable()
export class ResolverStudyService implements Resolve<Observable<any>> {

    constructor(private _http: GlobalHttpService) { }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._http.get_all_study()
    }
}
//----------------------------------------------------------------------------------------------
@Injectable()
export class ResolverTeacherService implements Resolve<Observable<any>> {

    constructor(private _http: GlobalHttpService) { }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._http.get_all_teacher();
    }
}

