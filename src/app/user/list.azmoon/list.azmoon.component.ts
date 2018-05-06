import { Component, ViewChild } from "@angular/core";
import { GlobalHttpService } from "../../http.service/global.http.service";
import { MessageService } from "../../util/message.service";
import { PersianCalendarService } from "../../util/persian.calendar.service";
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { ListAzmoonDetailComponent } from "./list.azmoon.detail.component";
import { FormGroup, FormBuilder, Validators, AbstractControlDirective, AbstractControl, FormControl, FormArray } from "@angular/forms";
import { Lesson } from "../../classes/public.class";

import * as _ from 'lodash';
import { take } from "rxjs/operators";

@Component({
    selector: 'list-azmoon-component',
    templateUrl: 'list.azmoon.component.html',
    styleUrls: ['list.azmoon.component.css']
})
export class ListAzmoonComponent {
    dataForm: FormGroup;
    azmoon_question: FormControl;
    answer_fine: FormControl;
    answer_help: FormControl;
    question_grade: FormControl;
    question_level: FormControl;
    exam_time: FormControl;
    //--------------------------------------------
    data_list: any[] = [];
    teacher_select: any = undefined;
    //--------------------------------------------
    teacher_list: any[] = [];
    study_list: any[] = [];
    level_list: any[] = [];
    lesson_list: any[] = [];
    question_list: any[] = [];
    question_level_list: any[] = [];
    //--------------------------------------------
    today: Date = new Date();
    farsiDate_short: any = null;
    farsiDate_long: any = null;
    state_save: any;
    date_message: any;
    answer: any;
    //--------------------------------------------
    show_exam_list: any = false;
    show_exam_detail: any = false;
    show_question_detail: any = false;
    //--------------------------------------------
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selectedRowIndex: number = -1;
    index: number = -1;
    displayedColumns = ['select', 'exam_name', 'exam_study', 'exam_level', 'exam_lesson', 'last_update_long', 'operate', 'update_admin'];
    dataSource = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(false, []);
    //--------------------------------------------
    @ViewChild(MatPaginator) paginatorQuestion: MatPaginator;
    @ViewChild(MatSort) sortQuestion: MatSort;
    selectedRowIndex_question: number = -1;
    index_question: number = -1;
    displayedColumns_question = ['select', 'question_number', 'question_text', 'question_grade', 'question_level', 'open_dialog'];
    dataSource_question = new MatTableDataSource<any>();
    selection_question = new SelectionModel<any>(false, []);
    //--------------------------------------------
    constructor(private fb: FormBuilder, private _msg: MessageService,
        private persianCalendarService: PersianCalendarService,
        private _http: GlobalHttpService, private dialog: MatDialog) {
        this.createForm();
    }
    //--------------------------------------------        
    ngOnInit() {
        this.farsiDate_short = this.persianCalendarService.PersianCalendarShort(this.today);
        this.farsiDate_long = this.persianCalendarService.PersianCalendar(this.today);
        this.date_message = "تاریخ ذخیره سازی : " + this.farsiDate_long;
        this.level_list = this._msg.getLevel();
        this.question_level_list = this._msg.getQuestionLevel();
        this._http.get_all_teacher().subscribe((res: any) => {
            this.teacher_list = res;
        })
    }
    studyChange(event) {
        this._http.get_lesson_by_study(event.value).pipe(take(1)).subscribe((res: any) => {
            this.lesson_list = res;
        })
    }
    createForm() {
        this.dataForm = this.fb.group({
            _id: [''],
            exam_name: ['', Validators.required],
            exam_teacher: ['', Validators.required],
            exam_study: ['', Validators.required],
            exam_level: ['', Validators.required],
            exam_lesson: [],
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
        this.azmoon_question = new FormControl('', Validators.required);
        this.answer_fine = new FormControl('', Validators.required);
        this.answer_help = new FormControl('');
        this.question_grade = new FormControl('', Validators.required);
        this.question_level = new FormControl('', Validators.required);
        this.exam_time = new FormControl(60, Validators.compose([Validators.required, Validators.pattern('[0-9]*')]));
    }
    //-------------------------------------------------------------------------------
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
    search() {
        if (this.teacher_select) {
            this._http.get_all_exam_by_teacher_name(this.teacher_select).pipe(take(1)).subscribe((res: any) => {
                if (res.length > 0) {
                    this.data_list = res;
                    this.dataSource.data = this.data_list;
                    this.show_exam_list = true;
                } else {
                    this._msg.getMessage('notExistRecord');
                    this.show_exam_list = false;
                    this.show_exam_detail = false;
                }
            })
        }
    }
    show_detail(value) {
        this.dataForm.patchValue({
            _id: value._id,
            exam_code: value.exam_code,
            exam_name: value.exam_name,
            exam_teacher: value.exam_teacher,
            exam_study: value.exam_study,
            exam_level: value.exam_level,
            exam_lesson: value.exam_lesson,
            exam_lesson_detail: value.exam_lesson_detail,
            exam_rank: value.exam_rank,
            exam_time: value.exam_time,
            isEnable: value.isEnable,
            exam_questions: value.exam_questions,
            last_update_long: value.last_update_long,
            last_update_short: value.last_update_short,
        });
        this.study_list = _.find(this.teacher_list, { teacher_name: value.exam_teacher }, function (o) { return o; }).teacher_study;
        this._http.get_lesson_by_study(value.exam_study).pipe(take(1)).subscribe((res: any) => {
            this.lesson_list = res;
        });
        this.question_list = value.exam_questions;
        this.dataSource_question.data = this.question_list;
        this.show_exam_detail = true;
    }
    open_dialog(data) {
        let dialogRef = this.dialog.open(ListAzmoonDetailComponent, {
            width: '50%',
            data: { data: data }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.answer = result;
        });
    }
    get questions(): FormArray {
        return this.dataForm.get('exam_questions') as FormArray;
    };
    //-------------------------------------------------------------------------------
    selectRow(event) {
        this.selectedRowIndex = event._id;
        this.index = this.data_list.indexOf(event);
        this.selection.toggle(event);
    }
    selectRow_question(event) {
        this.selectedRowIndex_question = event.question_number;
        this.index_question = this.question_list.indexOf(event);
        this.selection_question.toggle(event);
        this.azmoon_question.setValue(event.question_text);
        this.question_grade.setValue(event.question_grade);
        this.question_level.setValue(event.question_level);
        this.answer_fine.setValue(event.answer_fine);
        this.answer_help.setValue(event.answer_help);
        this.show_question_detail = true;
    }
    update_question() {
        let value: any;
        if (this.answer != undefined) value = this.answer;
        else {
            let data: any = {
                answerOne_text: '', answerOne_image: '',
                answerTwo_text: '', answerTwo_image: '',
                answerThree_text: '', answerThree_image: '',
                answerFour_text: '', answerFour_image: '', question_number: ''
            };
            data.answerOne_text = this.selection_question.selected[0]['answerOne_text'];
            data.answerOne_image = this.selection_question.selected[0]['answerOne_image'];

            data.answerTwo_text = this.selection_question.selected[0]['answerTwo_text'];
            data.answerTwo_image = this.selection_question.selected[0]['answerTwo_image'];

            data.answerThree_text = this.selection_question.selected[0]['answerThree_text'];
            data.answerThree_image = this.selection_question.selected[0]['answerThree_image'];

            data.answerFour_text = this.selection_question.selected[0]['answerFour_text'];
            data.answerFour_image = this.selection_question.selected[0]['answerFour_image'];

            data.question_number = this.selection_question.selected[0]['question_number'];;
            value = data;
        }
        var question_index = _.findIndex(this.dataSource_question.data, { question_number: value.question_number }, function (o) { return o; });
        this.question_list[question_index]['answer_fine'] = +this.answer_fine.value;
        this.question_list[question_index]['answer_help'] = this.answer_help.value;
        this.question_list[question_index]['question_level'] = this.question_level.value;
        this.question_list[question_index]['question_grade'] = this.question_grade.value;
        this.question_list[question_index]['question_text'] = this.azmoon_question.value;

        this.question_list[question_index]['answerOne_text'] = value.answerOne_text;
        if (value.answerOne_image != null)
            this.question_list[question_index]['answerOne_image'] = value.answerOne_image;

        this.question_list[question_index]['answerTwo_text'] = value.answerTwo_text;
        if (value.answerTwo_image != null)
            this.question_list[question_index]['answerTwo_image'] = value.answerTwo_image;

        this.question_list[question_index]['answerThree_text'] = value.answerThree_text;
        if (value.answerThree_image != null)
            this.question_list[question_index]['answerThree_image'] = value.answerThree_image;

        this.question_list[question_index]['answerFour_text'] = value.answerFour_text;
        if (value.answerFour_image != null)
            this.question_list[question_index]['answerFour_image'] = value.answerFour_image;
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
    update(value) {
        for (let i = 0; i < this.question_list.length; i++) {
            this.questions.removeAt(i);
            this.questions.insert(i,
                this.answerArray(i, this.question_list[i].question_text, this.question_list[i].question_level,
                    this.question_list[i].question_grade, this.question_list[i].answer_fine, this.question_list[i].answer_help,
                    this.question_list[i].answerOne_text, this.question_list[i].answerOne_image,
                    this.question_list[i].answerTwo_text, this.question_list[i].answerTwo_image,
                    this.question_list[i].answerThree_text, this.question_list[i].answerThree_image,
                    this.question_list[i].answerFour_text, this.question_list[i].answerFour_image));
        }
        this._http.exam_validate_for_update(this.dataForm.get('_id').value,this.dataForm.get('exam_name').value).pipe(take(1)).subscribe((res: any) => {
            if (res.length > 0) {
                this._msg.getMessage('doubleRecord');
            } else {
                this.dataForm.get('last_update_short').setValue(this.farsiDate_short);
                this.dataForm.get('last_update_long').setValue(this.farsiDate_long);
                this.dataForm.get('isEnable').setValue(true);
                let lesson = _.find(this.lesson_list, { lesson_name: this.dataForm.get('exam_lesson').value }, function (o) { return o; });
                this.dataForm.get('exam_lesson_detail').patchValue({
                    _id: lesson._id,
                    lesson_code: lesson.lesson_code,
                    lesson_name: lesson.lesson_name,
                    lesson_pic: lesson.lesson_pic
                })
                if (value == 'admin') this.dataForm.get('isAdmin').setValue(true);
                this._http.update_exam(this.dataForm.value).pipe(take(1)).subscribe((json: any) => {
                    if (json.nModified >= 1) {
                        this._msg.getMessage('okUpdate');
                    } else {
                        this._msg.getMessage('errorUpdate');
                    }
                });
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