import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControlDirective, AbstractControl, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import 'rxjs/add/operator/take';
import { MessageService } from '../../util/message.service';
import { PersianCalendarService } from '../../util/persian.calendar.service';
import { GlobalHttpService } from '../../http.service/global.http.service';
import { MatHorizontalStepper, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Lesson } from '../../classes/public.class';

@Component({
    selector: 'new-define',
    templateUrl: 'new.define.azmoon.component.html',
    styleUrls: ['new.define.azmoon.component.css']
})
export class NewDefineAzmoonComponent {
    dataForm: FormGroup;
    answerOne: FormGroup;
    answerTwo: FormGroup;
    answerThree: FormGroup;
    answerFour: FormGroup;
    //--------------------------
    azmoon_question: FormControl;
    answer_fine: FormControl;
    answer_help: FormControl;
    question_grade: FormControl;
    question_level: FormControl;
    exam_time: FormControl;
    //-------------------------
    today: Date = new Date();
    farsiDate_short: any = null;
    farsiDate_long: any = null;
    state_save: any;
    date_message: any;
    //-------------------------
    fileError_one: any;
    fileError_two: any;
    fileError_three: any;
    fileError_four: any;
    //-------------------------------------------------------------------------------
    teacher_list: any[] = [];
    study_list: any[] = [];
    level_list: any[] = [];
    lesson_list: any[] = [];
    question_level_list: any[] = [];
    question_list: any[] = [];
    data_list: any[] = [];
    @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
    //-------------------------------------------------------------------------------
    isLinear = true;
    isQuestionTable = false;
    //-------------------------------------------------------------------------------
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selectedRowIndex: number = -1;
    index: number = -1;
    displayedColumns = ['select', 'index', 'question_text', 'question_level', 'question_grade', 'answer_fine'];
    dataSource = new MatTableDataSource<any>();
    //----------
    selection = new SelectionModel<any>(false, []);
    //-------------------------------------------------------------------------------
    constructor(private fb: FormBuilder, private _msg: MessageService,
        private persianCalendarService: PersianCalendarService,
        private _http: GlobalHttpService,
        private route: ActivatedRoute) {
        this.state_save = true;
        this.azmoon_question = new FormControl('', Validators.required);
        this.answer_fine = new FormControl('', Validators.required);
        this.answer_help = new FormControl('');
        this.question_grade = new FormControl('', Validators.required);
        this.question_level = new FormControl('', Validators.required);
        this.exam_time = new FormControl(60, Validators.compose([Validators.required, Validators.pattern('[0-9]*')]));
        this.createForm();
    }
    //-------------------------------------------------------------------------------
    ngOnInit() {
        this.farsiDate_short = this.persianCalendarService.PersianCalendarShort(this.today);
        this.farsiDate_long = this.persianCalendarService.PersianCalendar(this.today);
        this.date_message = "تاریخ ذخیره سازی : " + this.farsiDate_long;
        this.level_list = this._msg.getLevel();
        this.question_level_list = this._msg.getQuestionLevel();

        this._http.get_all_teacher().subscribe((res: any) => {
            this.teacher_list = res;
        })
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    }
    teacherChange(event) {
        this.study_list = _.find(this.teacher_list, { teacher_name: event.value }, function (o) { return o; }).teacher_study;
    }
    studyChange(event) {
        this._http.get_lesson_by_study(event.value).take(1).subscribe((res: any) => {
            this.lesson_list = res;
        })
    }
    //-------------------------------------------------------------------------------
    resetForm() {
        this.dataForm.reset();
        this.state_save = true;
        this.date_message = "تاریخ ذخیره سازی : " + this.farsiDate_long;
    }
    //-------------------------------------------------------------------------------
    createForm() {
        this.dataForm = this.fb.group({
            _id: [''],
            exam_name: ['', Validators.required],
            exam_teacher: ['', Validators.required],
            exam_study: ['', Validators.required],
            exam_level: ['', Validators.required],
            exam_lesson: [''],
            exam_lesson_detail: [{ ...Lesson }],
            exam_rank: [0],
            exam_time: [0],
            exam_price: [0],
            isEnable: [false],
            isAdmin: [false],
            hasUser: [false],
            exam_questions: this.fb.array([]),
            last_update_long: [''],
            last_update_short: ['']
        });
        this.answerOne = this.fb.group({
            answer_text: [null],
            answer_image: [null]
        })
        this.answerTwo = this.fb.group({
            answer_text: [null],
            answer_image: [null]
        })
        this.answerThree = this.fb.group({
            answer_text: [null],
            answer_image: [null]
        })
        this.answerFour = this.fb.group({
            answer_text: [null],
            answer_image: [null]
        })
    }
    answerArray(question_number?: any, question_text?: any, question_level?: any, question_grade?: any,
        answer_fine?: any, answer_help?: any,
        answerOne_text?: any, answerOne_image?: any,
        answerTwo_text?: any, answerTwo_image?: any,
        answerThree_text?: any, answerThree_image?: any,
        answerFour_text?: any, answerFour_image?: any): FormGroup {
        return this.fb.group({
            question_number: [question_number],
            question_text: [question_text],
            question_level: [question_level],
            question_grade: [question_grade],

            answerOne_text: [answerOne_text],
            answerOne_image: [answerOne_image],

            answerTwo_text: [answerTwo_text],
            answerTwo_image: [answerTwo_image],

            answerThree_text: [answerThree_text],
            answerThree_image: [answerThree_image],

            answerFour_text: [answerFour_text],
            answerFour_image: [answerFour_image],

            answer_fine: [answer_fine],
            answer_help: [answer_help],
        })
    }
    //-----------------------------------------------------------------------------------------
    answerOne_reset() {
        this.answerOne.reset();
        var canvas: any = document.getElementById("canvasOne");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    answerTwo_reset() {
        this.answerTwo.reset();
        var canvas: any = document.getElementById("canvasTwo");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    answerThree_reset() {
        this.answerThree.reset();
        var canvas: any = document.getElementById("canvasThree");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    answerFour_reset() {
        this.answerFour.reset();
        var canvas: any = document.getElementById("canvasFour");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    //-----------------------------------------------------------------------------------------
    readFileOne(input) {
        var reader = new FileReader();
        var self = this;
        reader.onload = function (e) {
            var img = new Image();
            if (self.stepper._focusIndex == 0) {
                self.answerOne.get('answer_image').setValue(reader.result);
                if (self.answerOne.get('answer_text').value == null)
                    self.answerOne.get('answer_text').setValue(' ');
                var canvas: any = document.getElementById("canvasOne");
                var ctx = canvas.getContext("2d");
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                }
            }
            img.src = reader.result;
        };
        var file = (<HTMLInputElement>document.getElementById('fileImportOne')).files[0];
        if (file) {
            reader.readAsDataURL(file);
        }
    }
    readFileTwo(input) {
        var reader = new FileReader();
        var self = this;
        reader.onload = function (e) {
            var img = new Image();
            if (self.stepper._focusIndex == 1) {
                self.answerTwo.get('answer_image').setValue(reader.result);
                if (self.answerTwo.get('answer_text').value == null)
                    self.answerTwo.get('answer_text').setValue(' ');
                var canvas: any = document.getElementById("canvasTwo");
                var ctx = canvas.getContext("2d");
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                }
            }
            img.src = reader.result;
        };
        var file = (<HTMLInputElement>document.getElementById('fileImportTwo')).files[0];
        if (file) {
            reader.readAsDataURL(file);
        }
    }
    readFileThree(input) {
        var reader = new FileReader();
        var self = this;
        reader.onload = function (e) {
            var img = new Image();
            if (self.stepper._focusIndex == 2) {
                self.answerThree.get('answer_image').setValue(reader.result);
                if (self.answerThree.get('answer_text').value == null)
                    self.answerThree.get('answer_text').setValue(' ');
                var canvas: any = document.getElementById("canvasThree");
                var ctx = canvas.getContext("2d");
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                }
            }
            img.src = reader.result;
        };
        var file = (<HTMLInputElement>document.getElementById('fileImportThree')).files[0];
        if (file) {
            reader.readAsDataURL(file);
        }
    }
    readFileFour(input) {
        var reader = new FileReader();
        var self = this;
        reader.onload = function (e) {
            var img = new Image();
            if (self.stepper._focusIndex == 3) {
                self.answerFour.get('answer_image').setValue(reader.result);
                if (self.answerFour.get('answer_text').value == null)
                    self.answerFour.get('answer_text').setValue(' ');
                var canvas: any = document.getElementById("canvasFour");
                var ctx = canvas.getContext("2d");
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                }
            }
            img.src = reader.result;
        };
        var file = (<HTMLInputElement>document.getElementById('fileImportFour')).files[0];
        if (file) {
            reader.readAsDataURL(file);
        }
    }
    get questions(): FormArray {
        return this.dataForm.get('exam_questions') as FormArray;
    };
    insert_new_question(data: any, rowId: number) {
        if (data == 'insert') var index = this.data_list.length;
        if (data == 'update') var index = rowId;
        this.questions.push(this.answerArray(index, this.azmoon_question.value, this.question_level.value, this.question_grade.value,
            this.answer_fine.value, this.answer_help.value,
            this.answerOne.get('answer_text').value, this.answerOne.get('answer_image').value,
            this.answerTwo.get('answer_text').value, this.answerTwo.get('answer_image').value,
            this.answerThree.get('answer_text').value, this.answerThree.get('answer_image').value,
            this.answerFour.get('answer_text').value, this.answerFour.get('answer_image').value));
        this.data_list = this.questions.value;
        this.dataSource.data = this.data_list;
        //-------------------------------------------------------------------------------------
        this.answerOne_reset(); this.answerTwo_reset(); this.answerThree_reset(); this.answerFour_reset();
        this.azmoon_question.reset(); this.question_level.reset(); this.question_grade.reset();
        this.answer_fine.reset(); this.answer_help.reset(); this.stepper.reset();
        this.state_save = true;
        //-------------------------------------------------------------------------------------
    }
    update_new_question() {
        var question_index = _.findIndex(this.dataSource.data, { question_text: this.selection.selected[0]['question_text'] }, function (o) { return o; })
        this.questions.removeAt(question_index);
        this.insert_new_question('update', question_index);
        this.selectedRowIndex = -1; this.index = -1;
        this.state_save = true;
    }
    selectRow(event) {
        this.state_save = false;
        this.selectedRowIndex = event.question_number;
        this.index = this.data_list.indexOf(event);
        this.answer_fine.setValue(event.answer_fine);
        this.answer_help.setValue(event.answer_help);
        this.question_grade.setValue(event.question_grade);
        this.question_level.setValue(event.question_level);
        this.azmoon_question.setValue(event.question_text);

        this.answerOne.patchValue({
            answer_text: event.answerOne_text,
            answer_image: event.answerOne_image
        });
        this.answerTwo.patchValue({
            answer_text: event.answerTwo_text,
            answer_image: event.answerTwo_image
        });
        this.answerThree.patchValue({
            answer_text: event.answerThree_text,
            answer_image: event.answerThree_image
        });
        this.answerFour.patchValue({
            answer_text: event.answerFour_text,
            answer_image: event.answerFour_image
        });
        this.dataForm.patchValue(event);
        this.date_message = "تاریخ ویرایش : " + this.farsiDate_long;
        this.selection.toggle(event);
    }
    //-------------------------------------------------------------------------------
    save(data) {
        var has_error = false;
        this._http.get_all_exam_by_axam_name(data.exam_name).take(1).subscribe((res: any) => {
            if (res.length > 0) {
                has_error = true;
                this._msg.getMessage('doubleRecord');
            } else {
                if (this.dataForm.status == 'VALID') {
                    delete data._id;
                    data.last_update_short = this.farsiDate_short;
                    data.last_update_long = this.farsiDate_long;
                    data.exam_time = +this.exam_time.value;
                    this.data_list = [];
                    this.dataSource.data = this.data_list;
                    
                    let lesson = _.find(this.lesson_list, { lesson_name: data.exam_lesson }, function (o) { return o; });
                    data.exam_lesson_detail._id = lesson._id;
                    data.exam_lesson_detail.lesson_code = lesson.lesson_code;
                    data.exam_lesson_detail.lesson_name = lesson.lesson_name;
                    data.exam_lesson_detail.lesson_pic = lesson.lesson_pic;
                    this._http.save_exam(data).take(1).subscribe((json: any) => {
                        if (json.result.n >= 1) {
                            this._msg.getMessage('okSave');
                            this.data_list = [];
                            this.dataSource.data = this.data_list;
                            this.answerOne_reset(); this.answerTwo_reset();
                            this.answerThree_reset(); this.answerFour_reset();
                            this.azmoon_question.reset(); this.question_level.reset();
                            this.question_grade.reset(); this.answer_fine.reset();
                            this.answer_help.reset(); this.stepper.reset();
                            this.isQuestionTable = false;
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
        })
    }
    //-------------------------------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
}