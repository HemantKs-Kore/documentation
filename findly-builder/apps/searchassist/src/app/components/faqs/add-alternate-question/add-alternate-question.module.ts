// import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AddAlternateQuestionComponent } from './add-alternate-question.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AddAlternateQuestionComponent],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatChipsModule,
    FormsModule,
    // MatIconModule,
  ],
  exports: [AddAlternateQuestionComponent],
})
export class AddAlternateQuestionModule {}
