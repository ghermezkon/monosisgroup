import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from './http.service/AuthService';
import { Title } from '@angular/platform-browser';
import { NgProgress} from '@ngx-progressbar/core';
import { NgProgressRef } from '@ngx-progressbar/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn$: Observable<boolean>;
  progressRef: NgProgressRef;
  //------------------------------------------------------------------------------
  constructor(private router: Router, private auth: AuthService, private title: Title, private ngProgress: NgProgress) {
    this.title.setTitle('گروه آموزشی مونوسیس');
  }
  //------------------------------------------------------------------------------
  ngOnInit() {
    this.progressRef = this.ngProgress.ref();
    this.isLoggedIn$ = this.auth.isLoggedIn;
  }
  onLogout() {
    this.auth.logout();
  }
  ngOnDestroy() {
    this.ngProgress.destroy();
  }
  //------------------------------------------------------------------------------
}
