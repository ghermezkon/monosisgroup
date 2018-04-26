import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MessageDialogComponent } from "./message.dialog";
import { ConfirmDialogComponent } from "./confirm.dialog";

@Injectable()
export class MessageService {
    constructor(private dialog: MatDialog) { }
    getError(error) {
        if (error.required)
            return '* الزامی';
        else if (error.pattern)
            return 'فقط عدد وارد نمائید';
        else if (error.maxlength)
            return 'حداکثر ' + error.maxlength.requiredLength + ' حرف وارد نمائید';
        else if (error.minlength)
            return 'حداقل ' + error.minlength.requiredLength + ' حرف وارد نمائید';
        else if (error.email)
            return 'آدرس ایمیل اشتباه است';
    }
    getMessage(name) {
        if (name == 'okSave')
            this.openDialog('ذخیره اطلاعات با موفقیت انجام گردید');
        else if (name == 'errorSave')
            this.openDialog('خطا در ذخیره اطلاعات');
        else if (name == 'okUpdate')
            this.openDialog('ویرایش اطلاعات با موفقیت انجام گردید');
        else if (name == 'errorUpdate')
            this.openDialog('خطا در ویرایش اطلاعات');
        else if (name == 'doubleRecord')
            this.openDialog('رکورد ورودی تکراری می باشد');
        else if (name == 'notExistRecord')
            this.openDialog('رکورد مورد نظر در سیستم تعریف نشده است');
        else if (name == "fileError")
            this.openDialog("فراخوانی فایل با مشکل روبرو شده است");
        else if (name == "okFile")
            this.openDialog("فراخوانی فایل انجام گردید");
        else if (name == "errorInput")
            this.openDialog("لطفاً اطلاعات را کامل وارد نمائید");
        else if (name == "confirmDelete")
            return this.openConfirm("آیا تمایل به حذف رکورد دارید؟");
    }
    getTeacherSexType() {
        let teacherType: any[] = [];
        teacherType.push('زن');
        teacherType.push('مرد');
        return teacherType;
    }
    getRole() {
        let role: any[] = [];
        role.push('آموزگار');
        role.push('دانش آموز');
        role.push('مدیر برنامه');
        return role;
    }    
    getLevel() {
        let level: any[] = [];
        level.push('ساده');
        level.push('متوسط');
        level.push('سخت');
        level.push('پیشرفته');
        return level;
    }
    getQuestionLevel() {
        let questionLevel: any[] = [];
        questionLevel.push('سوال ساده');
        questionLevel.push('سوال متوسط');
        questionLevel.push('سوال سخت');
        return questionLevel;
    }
    openDialog(msg): void {
        let dialogRef = this.dialog.open(MessageDialogComponent, {
            width: '50%',
            data: { message: msg }
        });
    }

    openConfirm(msg) {
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '50%',
            data: { message: msg }
        });
        return dialogRef;
    }
}