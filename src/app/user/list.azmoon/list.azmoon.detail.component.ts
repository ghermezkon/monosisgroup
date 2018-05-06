import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControlDirective, AbstractControl } from '@angular/forms';
import { MatHorizontalStepper, MatDialogRef } from '@angular/material';
import { MessageService } from '../../util/message.service';
import { PersianCalendarService } from '../../util/persian.calendar.service';
import { GlobalHttpService } from '../../http.service/global.http.service';

@Component({
    templateUrl: 'list.azmoon.detail.component.html'
})
export class ListAzmoonDetailComponent {
    panelOpenState: boolean = false;
    dataForm: FormGroup;
    answerOne: FormGroup;
    answerTwo: FormGroup;
    answerThree: FormGroup;
    answerFour: FormGroup;
    question_number: any;
    //----------------------------------------------------------
    today: Date = new Date();
    farsiDate_short: any = null;
    farsiDate_long: any = null;
    state_save: any;
    date_message: any;
    //----------------------------------------------------------
    isUpdate = false;
    isLinear = true;
    //----------------------------------------------------------
    @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
    //----------------------------------------------------------
    constructor(public dialogRef: MatDialogRef<ListAzmoonDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder, private _msg: MessageService,
        private persianCalendarService: PersianCalendarService, private _http: GlobalHttpService) {
        this.state_save = true;
        this.createForm();
    }
    //----------------------------------------------------------
    createForm() {
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
    //----------------------------------------------------------
    ngOnInit() {
        this.farsiDate_short = this.persianCalendarService.PersianCalendarShort(this.today);
        this.farsiDate_long = this.persianCalendarService.PersianCalendar(this.today);
        this.date_message = "تاریخ ذخیره سازی : " + this.farsiDate_long;
    }
    show_detail(value) {
        this.question_number = value.question_number;
        this.answerOne.patchValue({ answer_text: value.answerOne_text, answer_image: value.answerOne_image })
        this.answerTwo.patchValue({ answer_text: value.answerTwo_text, answer_image: value.answerTwo_image })
        this.answerThree.patchValue({ answer_text: value.answerThree_text, answer_image: value.answerThree_image })
        this.answerFour.patchValue({ answer_text: value.answerFour_text, answer_image: value.answerFour_image })
        if (this.answerOne.get('answer_image').value != null) {
            var img_1 = new Image();
            var canvas_1: any = document.getElementById("canvasOne");
            var ctx_1 = canvas_1.getContext("2d");
            img_1.onload = function () {
                canvas_1.width = img_1.width;
                canvas_1.height = img_1.height;
                ctx_1.drawImage(img_1, 0, 0);
            }
            img_1.src = this.answerOne.get('answer_image').value;
        }
        if (value.answerTwo_image != null) {
            var img_2 = new Image();
            var canvas_2: any = document.getElementById("canvasTwo");
            var ctx_2 = canvas_2.getContext("2d");
            img_2.onload = function () {
                canvas_2.width = img_2.width;
                canvas_2.height = img_2.height;
                ctx_2.drawImage(img_2, 0, 0);
            }
            img_2.src = value.answerTwo_image;
        }
        if (value.answerThree_image != null) {
            var img_3 = new Image();
            var canvas_3: any = document.getElementById("canvasThree");
            var ctx_3 = canvas_3.getContext("2d");
            img_3.onload = function () {
                canvas_3.width = img_3.width;
                canvas_3.height = img_3.height;
                ctx_3.drawImage(img_3, 0, 0);
            }
            img_3.src = value.answerThree_image;
        }
        if (value.answerFour_image != null) {
            var img_4 = new Image();
            var canvas_4: any = document.getElementById("canvasFour");
            var ctx_4 = canvas_4.getContext("2d");
            img_4.onload = function () {
                canvas_4.width = img_4.width;
                canvas_4.height = img_4.height;
                ctx_4.drawImage(img_4, 0, 0);
            }
            img_4.src = value.answerFour_image;
        }
    }
    //----------------------------------------------------------
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
    //----------------------------------------------------------
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
    //----------------------------------------------------------
    readFileOne(input) {
        var reader = new FileReader();
        var self = this;
        reader.onload = function (e) {
            var img = new Image();
            if (self.stepper.selectedIndex == 0) {
                self.answerOne.get('answer_image').setValue(reader.result);
                self.answerOne.get('answer_text').setValue(' ');

                var canvas: any = document.getElementById("canvasOne_" + self.question_number);
                var ctx = canvas.getContext("2d");
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                }
                img.src = reader.result;
            }
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
            if (self.stepper.selectedIndex == 1) {
                self.answerTwo.get('answer_image').setValue(reader.result);
                self.answerTwo.get('answer_text').setValue(' ');
                var canvas: any = document.getElementById("canvasTwo_" + self.question_number);
                var ctx = canvas.getContext("2d");
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                }
                img.src = reader.result;
            }
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
            if (self.stepper.selectedIndex == 2) {
                self.answerThree.get('answer_image').setValue(reader.result);
                self.answerThree.get('answer_text').setValue(' ');
                var canvas: any = document.getElementById("canvasThree_" + self.question_number);
                var ctx = canvas.getContext("2d");
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                }
                img.src = reader.result;
            }
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
            if (self.stepper.selectedIndex == 3) {
                self.answerFour.get('answer_image').setValue(reader.result);
                self.answerFour.get('answer_text').setValue(' ');
                var canvas: any = document.getElementById("canvasFour_" + self.question_number);
                var ctx = canvas.getContext("2d");
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                }
                img.src = reader.result;
            }
        };
        var file = (<HTMLInputElement>document.getElementById('fileImportFour')).files[0];
        if (file) {
            reader.readAsDataURL(file);
        }
    }
    get questions(): FormArray {
        return this.dataForm.get('exam_questions') as FormArray;
    };

    ngOnDestroy() {
        this.data.answerOne_text = this.answerOne.get('answer_text').value;
        this.data.answerOne_image = this.answerOne.get('answer_image').value;

        this.data.answerTwo_text = this.answerTwo.get('answer_text').value;
        this.data.answerTwo_image = this.answerTwo.get('answer_image').value;

        this.data.answerThree_text = this.answerThree.get('answer_text').value;
        this.data.answerThree_image = this.answerThree.get('answer_image').value;

        this.data.answerFour_text = this.answerFour.get('answer_text').value;
        this.data.answerFour_image = this.answerFour.get('answer_image').value;

        this.data.question_number = this.question_number;

        this.dialogRef.close(this.data);
    }
    //----------------------------------------------------------
    getErrorMessage(value) {
        let control: AbstractControlDirective | AbstractControl;
        control = <AbstractControl>value;
        return this._msg.getError(control.errors);
    }
    //----------------------------------------------------------
}