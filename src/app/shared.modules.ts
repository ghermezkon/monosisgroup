import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@NgModule({
    imports: [
        FormsModule, ReactiveFormsModule, MatStepperModule, MatExpansionModule,MatSnackBarModule,MatProgressSpinnerModule,
        MatSidenavModule, MatToolbarModule, MatButtonModule, MatTabsModule, MatRadioModule,
        MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatDialogModule,
        MatAutocompleteModule, MatIconModule, MatTableModule, MatPaginatorModule, MatSortModule,
        MatCardModule, MatMenuModule, MatChipsModule, MatListModule, MatGridListModule, MatProgressBarModule
    ],
    exports: [
        FormsModule, ReactiveFormsModule, MatStepperModule, MatExpansionModule,MatSnackBarModule,MatProgressSpinnerModule,
        MatSidenavModule, MatToolbarModule, MatButtonModule, MatTabsModule, MatRadioModule,
        MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatDialogModule,
        MatAutocompleteModule, MatIconModule, MatTableModule, MatPaginatorModule, MatSortModule,
        MatCardModule, MatMenuModule, MatChipsModule, MatListModule, MatGridListModule, MatProgressBarModule
    ]
})
export class SharedModule {
    constructor() { }
}
