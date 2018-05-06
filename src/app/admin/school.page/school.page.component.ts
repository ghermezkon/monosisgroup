import { Component, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControlDirective, AbstractControl } from "@angular/forms";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { map, take } from "rxjs/operators";
import * as _ from 'lodash';
import { SelectionModel } from "@angular/cdk/collections";
import { MessageService } from "../../util/message.service";
import { PersianCalendarService } from "../../util/persian.calendar.service";
import { GlobalHttpService } from "../../http.service/global.http.service";

@Component({
    selector: 'school-component',
    templateUrl: 'school.page.component.html',
    styleUrls: ['school.page.component.css']
})
export class SchoolPageComponent {
    dataForm: FormGroup;
    today: Date = new Date();
    farsiDate_short: any = null;
    farsiDate_long: any = null;
    state_save: any;
    date_message: any;
    data_list: any[] = [];
    //-------------------------------------------------------------------------------
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selectedRowIndex: number = -1;
    index: number = -1;
    displayedColumns = ['select', 'school_code', 'school_name', 'school_manager'];
    dataSource = new MatTableDataSource<any>();
    //----------
    selection = new SelectionModel<any>(false, []);

    constructor(private fb: FormBuilder, private _msg: MessageService, private _http: GlobalHttpService,
        private persianCalendarService: PersianCalendarService, private route: ActivatedRoute) {
        this.state_save = true;
        this.createForm();
    }
    ngOnInit() {
        this.farsiDate_short = this.persianCalendarService.PersianCalendarShort(this.today);
        this.farsiDate_long = this.persianCalendarService.PersianCalendar(this.today);
        this.date_message = "تاریخ ذخیره سازی : " + this.farsiDate_long;
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++    
        this.route.data.pipe(
            map((data) => data['azmoon_school'])).pipe(take(1)).subscribe((azmoon_school) => {
                if (azmoon_school.length > 0) {
                    this.data_list = azmoon_school;
                    this.dataSource.data = this.data_list;
                    this.resetForm();
                } else {
                    this.state_save = true;
                }
            });
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    //-------------------------------------------------------------------------------
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        this.dataSource.filter = filterValue;
    }
    //-------------------------------------------------------------------------------
    resetForm() {
        this.dataForm.reset();
        this.state_save = true;
        this.selectedRowIndex = -1;
        this.date_message = "تاریخ ذخیره سازی : " + this.farsiDate_long;
        this.selection.toggle(false);
    }
    //-------------------------------------------------------------------------------
    createForm() {
        this.dataForm = this.fb.group({
            _id: [''],
            school_code: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
            school_name: ['', Validators.required],
            school_manager: [''],
            school_code_posti: ['', Validators.pattern('[0-9]*')],
            school_email: [''],
            school_address: [''],
            last_update_long: [''],
            last_update_short: ['']
        });
    }
    save(data) {
        let find_index = _.findIndex(this.data_list, function (o) {
            return o.school_code == data.school_code || o.school_name == data.school_name;
        });
        if (find_index != -1) {
            this.resetForm();
            this._msg.getMessage('doubleRecord');
            return;
        }
        else if (this.dataForm.status == 'VALID') {
            delete data._id;
            data.last_update_short = this.farsiDate_short;
            data.last_update_long = this.farsiDate_long;
            this._http.save_school(data).pipe(take(1)).subscribe((json: any) => {
                if (json.result.n >= 1) {
                    this._msg.getMessage('okSave');

                    let list = [...this.data_list];
                    list.push(json.ops[0]);
                    this.data_list = list;
                    this.dataSource.data = this.data_list;

                    this.resetForm();
                } else {
                    this._msg.getMessage('errorSave');
                    this.resetForm();
                }
            });
        } else {
            this._msg.getMessage('errorSave');
        }
    }
    //-------------------------------------------------------------------------------
    update(data?: any) {
        let list = [...this.data_list];
        data.last_update_short = this.farsiDate_short;
        data.last_update_long = this.farsiDate_long;

        let find_index = _.findIndex(this.data_list, function (o) {
            return o.school_name == data.school_name || o.school_code == data.school_code;
        });
        if (find_index != -1 && find_index != this.index) {
            this.resetForm();
            this._msg.getMessage('doubleRecord');
            return;
        } else {
            this._http.update_school(data).pipe(take(1)).subscribe((json: any) => {
                if (json.nModified >= 1) {
                    this._msg.getMessage('okUpdate');

                    let index = _.findIndex(this.data_list, function (o) { return o._id == data._id; });
                    list[index] = data;
                    this.data_list = list;
                    this.dataSource.data = this.data_list;
                } else {
                    this._msg.getMessage('errorUpdate');
                }
            });
            this.resetForm();
        }
    }
    selectRow(event) {
        this.state_save = false;
        this.selectedRowIndex = event.school_code;
        this.index = this.data_list.indexOf(event);
        this.dataForm.patchValue(event);
        this.date_message = "تاریخ ویرایش : " + this.farsiDate_long;
        this.selection.toggle(event);
    }
    //-------------------------------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
}
//----------------------------------------------------------------------------------

