import { Component, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControlDirective, AbstractControl } from "@angular/forms";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/forkJoin';
import * as _ from 'lodash';
import { SelectionModel } from "@angular/cdk/collections";
import { MessageService } from "../../util/message.service";
import { PersianCalendarService } from "../../util/persian.calendar.service";
import { GlobalHttpService } from "../../http.service/global.http.service";
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'teacher-component',
    templateUrl: 'teacher.page.component.html',
    styleUrls: ['teacher.page.component.css']
})
export class TeacherPageComponent {
    dataForm: FormGroup;
    today: Date = new Date();
    farsiDate_short: any = null;
    farsiDate_long: any = null;
    state_save: any;
    date_message: any;
    data_list: any[] = [];
    teacher_sex_list: any[] = [];
    study_list: any[] = [];
    school_list: any[] = [];
    role_list: any[] = [];
    imgSrc: any = './assets/images/empty-profile.webp';
    showSpinner = false;
    //-------------------------------------------------------------------------------
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selectedRowIndex: number = -1;
    index: number = -1;
    displayedColumns = ['select', 'teacher_code', 'teacher_name', 'teacher_school', 'teacher_study', 'teacher_username'];
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
            map((data) => data['azmoon_teacher'])).take(1).subscribe((azmoon_teacher) => {
                if (azmoon_teacher.length > 0) {
                    this.data_list = azmoon_teacher;
                    this.dataSource.data = this.data_list;
                    this.resetForm();
                } else {
                    this.state_save = true;
                }
            });
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++                
        this.teacher_sex_list = this._msg.getTeacherSexType();
        this.role_list = this._msg.getRole();
        Observable.forkJoin(
            [
                this._http.get_all_study(),
                this._http.get_all_school()
            ]).take(1).subscribe((res: any) => {
                if (res[0].length > 0) {
                    this.study_list = res[0];
                }
                if (res[1].length > 0) {
                    this.school_list = res[1];
                }
            })
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
        this.imgSrc = './assets/images/empty-profile.webp';
    }
    //-------------------------------------------------------------------------------
    createForm() {
        this.dataForm = this.fb.group({
            _id: [''],
            teacher_code: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
            teacher_sex: [''],
            teacher_name: ['', Validators.required],
            teacher_study: [''],
            teacher_school: [''],
            teacher_degree: [''],
            teacher_mobile: ['', Validators.pattern('[0-9]*')],
            teacher_email: [''],
            teacher_pic: [''],
            teacher_rank: [0, Validators.pattern('[0-9]*')],
            teacher_sabeghe: [''],
            teacher_username: [''],
            teacher_password: [''],
            teacher_role: [''],
            teacher_account: [''],
            teacher_card: [''],
            balance: [0],
            isEnable: [true],
            isAdmin: [false],
            last_update_long: [''],
            last_update_short: ['']
        });
    }
    readFile(input) {
        var reader = new FileReader();
        var self = this;
        reader.onload = function (e) {
            self.imgSrc = reader.result;
        };
        var file = (<HTMLInputElement>document.getElementById('fileImport')).files[0];
        if (file) {
            reader.readAsDataURL(file);
        }
    }
    save(data) {
        let find_index = _.findIndex(this.data_list, function (o) {
            return o.teacher_code == data.teacher_code || o.teacher_name == data.teacher_name ||
                o.teacher_username == data.teacher_username;
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
            data.teacher_pic = this.imgSrc;
            this._http.save_teacher(data).take(1).subscribe((json: any) => {
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
        data.teacher_pic = this.imgSrc;
        let find_index = _.findIndex(this.data_list, function (o) {
            return o.teacher_name == data.teacher_name || o.teacher_code == data.teacher_code ||
                o.teacher_username == data.teacher_username;
        });
        if (find_index != -1 && find_index != this.index) {
            this.resetForm();
            this._msg.getMessage('doubleRecord');
            return;
        } else {
            this._http.update_teacher(data).take(1).subscribe((json: any) => {
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
        this.selectedRowIndex = event.teacher_code;
        this.index = this.data_list.indexOf(event);
        this.dataForm.patchValue(event);
        this.imgSrc = event.teacher_pic;
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

