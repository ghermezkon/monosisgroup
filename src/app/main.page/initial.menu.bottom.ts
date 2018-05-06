import { Component } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material";

@Component({
    selector: 'initial-menu-bottom',
    template:
        `
        <mat-nav-list style="direction:rtl;text-align:right;">
            <a [routerLink]="'/school'" (click)="openLink($event)" mat-list-item>
                <span mat-line>تعریف مدارس</span>
            </a>
        
            <a [routerLink]="'/study'" (click)="openLink($event)" mat-list-item>
                <span mat-line>تعریف مقاطع تحصیلی</span>
            </a>
        
            <a [routerLink]="'/lesson'" (click)="openLink($event)" mat-list-item>
                <span mat-line>تعریف دروس</span>
            </a>
        
            <a [routerLink]="'/teacher'" (click)="openLink($event)" mat-list-item>
                <span mat-line>تعریف آموزگار</span>
            </a>
        </mat-nav-list>       
    `
})
export class InitialMenuBottom {
    constructor(private bottomSheetRef: MatBottomSheetRef<InitialMenuBottom>) { }
    //-----------------------------------------------------------------------------
    openLink(event: MouseEvent): void {
        this.bottomSheetRef.dismiss();
        event.preventDefault();
    }
    //-----------------------------------------------------------------------------
}