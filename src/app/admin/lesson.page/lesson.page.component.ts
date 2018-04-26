import { Component, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControlDirective, AbstractControl } from "@angular/forms";
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import 'rxjs/add/operator/take';
import * as _ from 'lodash';
import { SelectionModel } from "@angular/cdk/collections";
import { MessageService } from "../../util/message.service";
import { PersianCalendarService } from "../../util/persian.calendar.service";
import { GlobalHttpService } from "../../http.service/global.http.service";
import { Study } from "../../classes/public.class";

@Component({
    selector: 'lesson-component',
    templateUrl: 'lesson.page.component.html',
    styleUrls: ['lesson.page.component.css']
})
export class LessonPageComponent {
    dataForm: FormGroup;
    today: Date = new Date();
    farsiDate_short: any = null;
    farsiDate_long: any = null;
    state_save: any;
    date_message: any;
    data_list: any[] = [];
    study_list: any[] = [];
    selected: any;
    imgSrc: any = './assets/images/empty.webp';
    //-------------------------------------------------------------------------------
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selectedRowIndex: number = -1;
    index: number = -1;
    displayedColumns = ['select', 'lesson_code', 'lesson_name', 'study.study_name'];
    dataSource = new MatTableDataSource<any>();
    //----------
    selection = new SelectionModel<any>(false, []);

    constructor(private fb: FormBuilder, private _msg: MessageService, private _http: GlobalHttpService,
        private persianCalendarService: PersianCalendarService, private route: ActivatedRoute, public snackBar: MatSnackBar) {
        this.state_save = true;
        this.createForm();
    }
    ngOnInit() {
        this.farsiDate_short = this.persianCalendarService.PersianCalendarShort(this.today);
        this.farsiDate_long = this.persianCalendarService.PersianCalendar(this.today);
        this.date_message = "تاریخ ذخیره سازی : " + this.farsiDate_long;
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++       
        this.route.data.pipe(
            map((data) => data['azmoon_study'])).take(1).subscribe((azmoon_study) => {
                if (azmoon_study.length > 0) {
                    this.study_list = azmoon_study;
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
        this.imgSrc = './assets/images/empty.webp';
        this.selection.toggle(false);
    }
    //-------------------------------------------------------------------------------
    createForm() {
        this.dataForm = this.fb.group({
            _id: [''],
            lesson_code: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
            lesson_name: ['', Validators.required],
            lesson_pic: [''],
            study: this.fb.group({ ...Study }),
            last_update_long: [''],
            last_update_short: ['']
        });
    }
    //-------------------------------------------------------------------------------
    studyChange(event) {
        if (event.value) {
            let study = _.find(this.study_list, { study_name: event.value }, function (o) { return o; });
            this.dataForm.get('study').patchValue(study);
            
            this._http.get_lesson_by_study(event.value).take(1).subscribe((res: any) => {
                this.data_list = res;
                this.dataSource.data = this.data_list;
            })
            this.dataForm.get('lesson_code').reset();
            this.dataForm.get('lesson_name').reset();
            this.imgSrc = './assets/images/empty.webp';
        } else {
            this.dataForm.patchValue({
                study: this.fb.group({ ...Study })
            });
        }
    }
    //-------------------------------------------------------------------------------
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
    //-------------------------------------------------------------------------------
    save(data) {
        let find_index = _.findIndex(this.data_list, function (o) {
            return o.lesson_code == data.lesson_code || o.lesson_name == data.lesson_name;
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
            data.lesson_pic = this.imgSrc;
            this._http.save_lesson(data).take(1).subscribe((json: any) => {
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
        data.lesson_pic = this.imgSrc;
        let find_index = _.findIndex(this.data_list, function (o) {
            return o.lesson_name == data.lesson_name || o.lesson_code == data.lesson_code;
        });
        if (find_index != -1 && find_index != this.index) {
            this.resetForm();
            this._msg.getMessage('doubleRecord');
            return;
        } else {
            this._http.update_school(data).take(1).subscribe((json: any) => {
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
    //-------------------------------------------------------------------------------
    selectRow(event) {
        this.state_save = false;
        this.selectedRowIndex = event.lesson_code;
        this.index = this.data_list.indexOf(event);
        this.dataForm.patchValue(event);
        if(event.lesson_pic == null)
            this.imgSrc = './assets/images/empty.webp';
        else
            this.imgSrc = event.lesson_pic;
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
