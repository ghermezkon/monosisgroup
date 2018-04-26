import { NgModule } from "@angular/core";
import { SchoolPageComponent } from "./school.page.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared.modules";
import { RouterModule, Routes } from "@angular/router";
import { ResolverSchoolService } from "../../http.service/resolver.service";

const SchoolRoutes: Routes = [
    { path: '', component: SchoolPageComponent, pathMatch: 'full', resolve: { azmoon_school: ResolverSchoolService } }
];
@NgModule({
    declarations: [SchoolPageComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild(SchoolRoutes)],
    exports: [RouterModule],
    providers: [ResolverSchoolService]
})
export class SchoolModule { }