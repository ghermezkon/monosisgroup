import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { ReplaySubject } from "rxjs";
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
@Injectable()
export class GlobalHttpService {
    azmoon_base: any = 'api/azmoon_base';
    azmoon_exam: any = 'api/azmoon_exam';
    azmoon_login: any = 'api/azmoon_login';
    //-------------------------------------------------------------------------
    headers: any;
    url_date: any = environment.apiEndPoint + '/api/currentDate';
    url_login: any = environment.apiEndPoint + this.azmoon_login + '/login';
    url_school: any = environment.apiEndPoint + this.azmoon_base + '/school';
    url_study: any = environment.apiEndPoint + this.azmoon_base + '/study';
    url_lesson: any = environment.apiEndPoint + this.azmoon_base + '/lesson';
    url_teacher: any = environment.apiEndPoint + this.azmoon_base + '/teacher';
    url_exam: any = environment.apiEndPoint + this.azmoon_exam;
    //-------------------------------------------------------------------------
    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders().set('enctype', 'multipart/form-data');
    }
    //-------------------------------------------------------------------------
    get_current_date() {
        return this.http.get(this.url_date);
    }
    //-------------------------------------------------------------------------
    get_all_school() {
        return this.http.get(this.url_school);
    }
    save_school(data?: any) {
        return this.http.post(this.url_school, data, { headers: this.headers });
    }
    update_school(data?: any) {
        return this.http.put(this.url_school, data, { headers: this.headers });
    }
    //-------------------------------------------------------------------------
    get_all_study() {
        return this.http.get(this.url_study);
    }
    save_study(data?: any) {
        return this.http.post(this.url_study, data, { headers: this.headers });
    }
    update_study(data?: any) {
        return this.http.put(this.url_study, data, { headers: this.headers });
    }
    //-------------------------------------------------------------------------
    get_lesson_by_study(study_code?: any) {
        return this.http.get(this.url_lesson + '/by_study/' + study_code);
    }
    get_all_lesson() {
        return this.http.get(this.url_lesson);
    }
    save_lesson(data?: any) {
        return this.http.post(this.url_lesson, data, { headers: this.headers });
    }
    update_lesson(data?: any) {
        return this.http.put(this.url_lesson, data, { headers: this.headers });
    }
    //-------------------------------------------------------------------------    
    get_all_teacher() {
        return this.http.get(this.url_teacher);
    }
    get_teacher_for_login(username, password) {
        return this.http.get(this.url_login + '/' + username + '/' + password + '/login');
    }
    save_teacher(data?: any) { 
        return this.http.post(this.url_teacher, data, { headers: this.headers });
    }
    update_teacher(data?: any) {
        return this.http.put(this.url_teacher, data, { headers: this.headers });
    }
    //-------------------------------------------------------------------------    
    get_all_exam_by_axam_name(exam_name?: any) {
        return this.http.get(this.url_exam + '/exam/' + exam_name);
    }
    exam_validate_for_update(exam_code?: any, exam_name?: any) {
        return this.http.get(this.url_exam + '/exam_validate_for_update/' + exam_code + '/' + exam_name);
    }
    get_all_exam_by_teacher_name(teacher_name?: any) {
        return this.http.get(this.url_exam + '/exam_find_by_teacher_name/' + teacher_name);
    }
    save_exam(data?: any) {
        return this.http.post(this.url_exam + '/exam', data, { headers: this.headers });
    }
    update_exam(data?: any) {
        return this.http.put(this.url_exam + '/exam', data, { headers: this.headers });
    }
}   