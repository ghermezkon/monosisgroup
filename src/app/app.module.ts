import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared.modules';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NgProgressRouterModule } from '@ngx-progressbar/router';

import { AppComponent } from './app.component';
import { MatPaginatorIntl, MatStepperIntl } from '@angular/material';
import { PaginatorLabel } from './util/paginator.label';
import { PagerService } from './util/pager.service';
import { PersianCalendarService } from './util/persian.calendar.service';
import { MessageService } from './util/message.service';
import { GlobalHttpService } from './http.service/global.http.service';
import { MessageDialogComponent } from './util/message.dialog';
import { ConfirmDialogComponent } from './util/confirm.dialog';
import { StepperLabel } from './util/stepper.label';
import { AuthService } from './http.service/AuthService';
import { AuthGuard } from './http.service/AuthGuard';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'monosisgroup' }),
    NoopAnimationsModule,
    HttpClientModule,
    NgProgressModule.forRoot(),
    NgProgressRouterModule,
    NgProgressHttpModule,
    SharedModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent, MessageDialogComponent, ConfirmDialogComponent
  ],
  entryComponents: [MessageDialogComponent, ConfirmDialogComponent],
  providers: [
    PagerService, PersianCalendarService, MessageService, GlobalHttpService,
    { provide: MatPaginatorIntl, useClass: PaginatorLabel },
    { provide: MatStepperIntl, useClass: StepperLabel },
    AuthService, AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() { }
}
