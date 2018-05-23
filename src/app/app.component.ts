import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from './http.service/AuthService';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { LoaderService } from './http.service/LoaderService';
import { GlobalHttpService } from './http.service/global.http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn$: Observable<boolean>;
  isLoader$: Observable<boolean>;
  resp: any;
  //------------------------------------------------------------------------------
  constructor(private router: Router, private auth: AuthService, private title: Title, private _loader: LoaderService, private _http: GlobalHttpService) {
    this.title.setTitle('گروه آموزشی مونوسیس');
  }
  //------------------------------------------------------------------------------
  ngOnInit() {
    this.isLoggedIn$ = this.auth.isLoggedIn;
    this.isLoader$ = this._loader.isLoader;
  }
  test() {
    this._http.payment().subscribe((res: any) => {
      this.resp = res;
    })
  }
  onLogout() {
    this.auth.logout();
  }
  //------------------------------------------------------------------------------
}
