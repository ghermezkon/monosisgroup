import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Validators, AbstractControlDirective, AbstractControl } from "@angular/forms";
import { MessageService } from "../util/message.service";
import { AuthService } from "../http.service/AuthService";
import { Observable } from "rxjs";

@Component({
    selector: 'login-component',
    templateUrl: 'login.page.component.html',
    styleUrls: ['login.page.component.css']
})
export class LoginComponent {
    //-----------------------------------------------------
    username: FormControl;
    password: FormControl;
    isLoginError$: Observable<string>;
    //-----------------------------------------------------
    constructor(private _msg: MessageService, private auth: AuthService) {
        this.username = new FormControl('', Validators.required);
        this.password = new FormControl('', Validators.required);
    }
    //-----------------------------------------------------
    ngOnInit() {
        this.isLoginError$ = this.auth.isLoginError;
    }
    //-----------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
    login() {
        this.auth.login(this.username.value, this.password.value);
    }
    //-----------------------------------------------------
}