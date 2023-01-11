import {
  NgbTooltipModule,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AddStructuredDataComponent } from './add-structured-data.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [AddStructuredDataComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CodemirrorModule,
    PerfectScrollbarModule,
    NgbTooltipModule,
    NgbDropdownModule,
  ],
  exports: [AddStructuredDataComponent],
})
export class AddStructuredDataModule {}
