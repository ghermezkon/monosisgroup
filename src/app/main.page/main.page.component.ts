import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { InitialMenuBottom } from './initial.menu.bottom';
import { ExamMenuBottom } from './exam.menu.bottom';

@Component({
    templateUrl: 'main.page.component.html',
})
export class MainPageComponent {
    main_menu: any[] = [];
    branchwork_menu: any[] = [];
    //--------------------------------------------
    constructor(private bottomSheet: MatBottomSheet) { }
    //----------------------------------------------
    ngOnInit() { }
    //----------------------------------------------
    initialMenu(): void {
        this.bottomSheet.open(InitialMenuBottom);
    }
    //----------------------------------------------
    examMenu(){
        this.bottomSheet.open(ExamMenuBottom);
    }
    //----------------------------------------------
}
