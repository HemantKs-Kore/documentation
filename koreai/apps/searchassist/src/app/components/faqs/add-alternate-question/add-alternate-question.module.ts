import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
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
    MatIconModule
  ],
  exports: [AddAlternateQuestionComponent],
})
export class AddAlternateQuestionModule {}
