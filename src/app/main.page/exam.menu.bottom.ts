import { Component } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material";

@Component({
    selector: 'exam-menu-bottom',
    template:
        `
        <mat-nav-list style="direction:rtl;text-align:right;">
            <a [routerLink]="'/define.azmoon'" (click)="openLink($event)" mat-list-item>
                <span mat-line>تعریف آزمون جدید</span>
            </a>
        
            <a [routerLink]="'/price.azmoon'" (click)="openLink($event)" mat-list-item>
                <span mat-line>تعیین قیمت آزمون ها</span>
            </a>
        
            <a [routerLink]="'/list.azmoon'" (click)="openLink($event)" mat-list-item>
                <span mat-line>لیست آزمون ها</span>
            </a>
        </mat-nav-list>       
    `
})
export class ExamMenuBottom {
    constructor(private bottomSheetRef: MatBottomSheetRef<ExamMenuBottom>) { }
    //-----------------------------------------------------------------------------
    openLink(event: MouseEvent): void {
        this.bottomSheetRef.dismiss();
        event.preventDefault();
    }
    //-----------------------------------------------------------------------------
}