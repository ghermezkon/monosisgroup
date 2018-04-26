import { Component, ViewChild } from "@angular/core";
import 'rxjs/add/operator/take';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators, AbstractControlDirective, AbstractControl } from "@angular/forms";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { MessageService } from "../../util/message.service";
import { PersianCalendarService } from "../../util/persian.calendar.service";
import { GlobalHttpService } from "../../http.service/global.http.service";

@Component({
    selector: 'price-azmoon-component',
    templateUrl: 'price.azmoon.component.html',
    styleUrls: ['price.azmoon.component.css']
})
export class PriceAzmoonComponent {
    dataForm: FormGroup;
    data: any;
    price: number;
    //------------------------------------------------------
    data_list: any[] = [];
    teacher_select: any = undefined;
    teacher_list: any[] = [];
    //------------------------------------------------------
    today: Date = new Date();
    farsiDate_short: any = null;
    farsiDate_long: any = null;
    date_message: any;
    show_exam_list: any = false;
    show_exam_detail: any = false;
    //------------------------------------------------------
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selectedRowIndex: number = -1;
    index: number = -1;
    displayedColumns = ['select', 'exam_code', 'exam_name', 'exam_study', 'exam_level',
        'exam_lesson', 'last_update_long', 'exam_price', 'operate'];
    dataSource = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(false, []);
    //------------------------------------------------------
    constructor(private fb: FormBuilder, private _msg: MessageService,
        private persianCalendarService: PersianCalendarService,
        private _http: GlobalHttpService) {
    }
    //------------------------------------------------------
    ngOnInit() {
        this.farsiDate_short = this.persianCalendarService.PersianCalendarShort(this.today);
        this.farsiDate_long = this.persianCalendarService.PersianCalendar(this.today);
        this.date_message = "تاریخ ذخیره سازی : " + this.farsiDate_long;

        this._http.get_all_teacher().subscribe((res: any) => {
            this.teacher_list = res;
        })
    }
    //------------------------------------------------------
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    //------------------------------------------------------
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        this.dataSource.filter = filterValue;
    }
    //------------------------------------------------------
    search() {
        if (this.teacher_select) {
            this._http.get_all_exam_by_teacher_name(this.teacher_select).take(1).subscribe((res: any) => {
                this.data_list = res;
                this.dataSource.data = this.data_list;
                this.show_exam_list = true;
            })
        }
    }
    //------------------------------------------------------
    show_detail(value) {
        this.data = value;
        this.show_exam_detail = true;
        this.price = this.data.exam_price;
    }
    //------------------------------------------------------
    selectRow(event) {
        this.selectedRowIndex = event.exam_code;
        this.index = this.data_list.indexOf(event);
        this.selection.toggle(event);
    }
    //------------------------------------------------------
    update() {
        let list = [...this.data_list];        
        this.data.exam_price = +this.price;
        this.data.last_update_short = this.farsiDate_short;
        this.data.last_update_long = this.farsiDate_long;
        this.data.isEnable = true;

        this._http.update_exam(this.data).take(1).subscribe((json: any) => {
            if (json.nModified >= 1) {
                this._msg.getMessage('okUpdate');
                this.show_exam_detail = false;
            } else {
                this._msg.getMessage('errorUpdate');
                this.show_exam_detail = false;
            }
        });
    }
    //------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
    //------------------------------------------------------
}