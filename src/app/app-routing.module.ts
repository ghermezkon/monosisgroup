import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main.page/main.page.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared.modules';
import { HighlightDirective } from './util/card.directive';
import { LoginComponent } from './login/login.page.component';
import { AuthGuard } from './http.service/AuthGuard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: MainPageComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'school', loadChildren: 'app/admin/school.page/school-routing.module#SchoolModule', canActivate: [AuthGuard] },
  { path: 'study', loadChildren: 'app/admin/study.page/study-routing.module#StudyModule', canActivate: [AuthGuard] },
  { path: 'lesson', loadChildren: 'app/admin/lesson.page/lesson-routing.module#LessonModule', canActivate: [AuthGuard] },
  { path: 'teacher', loadChildren: 'app/admin/teacher.page/teacher-routing.module#TeacherModule', canActivate: [AuthGuard] },
  { path: 'define.azmoon', loadChildren: 'app/user/define.azmoon/define.azmoon-routing.module#DefineAzmoonModule', canActivate: [AuthGuard] },
  { path: 'list.azmoon', loadChildren: 'app/user/list.azmoon/list.azmoon-routing.module#ListAzmoonModule', canActivate: [AuthGuard] },
  { path: 'price.azmoon', loadChildren: 'app/user/price.azmoon/price.azmoon-routing.module#PriceAzmoonModule', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forRoot(routes)],
  declarations: [MainPageComponent, LoginComponent, HighlightDirective],
  exports: [RouterModule],
})
export class AppRoutingModule { }
