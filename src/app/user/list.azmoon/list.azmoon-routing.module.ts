import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared.modules";
import { RouterModule } from "@angular/router";
import { ListAzmoonComponent } from "./list.azmoon.component";
import { ListAzmoonDetailComponent } from "./list.azmoon.detail.component";

@NgModule({
    declarations: [ListAzmoonComponent, ListAzmoonDetailComponent],
    entryComponents: [ListAzmoonDetailComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: ListAzmoonComponent
            },
        ])],
    providers: []
})
export class ListAzmoonModule { }