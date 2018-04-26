import { NgModule } from "@angular/core";
import { StudyPageComponent } from "./study.page.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared.modules";
import { RouterModule, Routes } from "@angular/router";
import { ResolverStudyService } from "../../http.service/resolver.service";

const SchoolRoutes: Routes = [
    { path: '', component: StudyPageComponent, pathMatch: 'full', resolve: { azmoon_study: ResolverStudyService } }
];
@NgModule({
    declarations: [StudyPageComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild(SchoolRoutes)],
    exports: [RouterModule],
    providers: [ResolverStudyService]
})
export class StudyModule { }