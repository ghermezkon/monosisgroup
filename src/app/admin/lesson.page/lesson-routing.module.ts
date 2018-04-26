import { NgModule } from "@angular/core";
import { LessonPageComponent } from "./lesson.page.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared.modules";
import { RouterModule, Routes } from "@angular/router";
import { ResolverStudyService } from "../../http.service/resolver.service";

const SchoolRoutes: Routes = [
    { path: '', component: LessonPageComponent, resolve: { azmoon_study: ResolverStudyService } }
];
@NgModule({
    declarations: [LessonPageComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild(SchoolRoutes)],
    exports: [RouterModule],
    providers: [ResolverStudyService]
})
export class LessonModule { }