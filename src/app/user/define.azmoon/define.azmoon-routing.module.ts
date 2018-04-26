import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared.modules";
import { RouterModule } from "@angular/router";
import { NewDefineAzmoonComponent } from "./new.define.azmoon.component";

@NgModule({
    declarations: [NewDefineAzmoonComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: NewDefineAzmoonComponent
            },
        ])],
    providers: []
})
export class DefineAzmoonModule { }