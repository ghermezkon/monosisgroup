import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared.modules';

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
import { InitialMenuBottom } from './main.page/initial.menu.bottom';
import { ExamMenuBottom } from './main.page/exam.menu.bottom';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderComponent } from './component/loader.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from './http.service/loader.interceptor';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'monosisgroup' }),
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent, MessageDialogComponent, ConfirmDialogComponent, InitialMenuBottom, ExamMenuBottom, LoaderComponent
  ],
  entryComponents: [MessageDialogComponent, ConfirmDialogComponent, InitialMenuBottom, ExamMenuBottom],
  providers: [
    { provide: MatPaginatorIntl, useClass: PaginatorLabel },
    { provide: MatStepperIntl, useClass: StepperLabel },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() { }
}
