import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared.modules";
import { RouterModule } from "@angular/router";
import { PriceAzmoonComponent } from "./price.azmoon.component";

@NgModule({
    declarations: [PriceAzmoonComponent],
    entryComponents: [],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: PriceAzmoonComponent
            },
        ])],
    providers: []
})
export class PriceAzmoonModule { }