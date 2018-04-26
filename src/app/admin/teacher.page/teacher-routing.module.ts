import { NgModule } from "@angular/core";
import { TeacherPageComponent } from "./teacher.page.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared.modules";
import { RouterModule, Routes } from "@angular/router";
import { ResolverTeacherService } from "../../http.service/resolver.service";

const teacherRoutes: Routes = [
    { path: '', component: TeacherPageComponent, resolve: { azmoon_teacher: ResolverTeacherService } }
];
@NgModule({
    declarations: [TeacherPageComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild(teacherRoutes)],
    exports: [RouterModule],
    providers: [ResolverTeacherService]
})
export class TeacherModule { }