import { MatFormFieldModule } from '@angular/material/form-field';
import { AddAlternateQuestionModule } from './../faqs/add-alternate-question/add-alternate-question.module';
import { SharedPipesModule } from './../../helpers/filters/shared-pipes.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { TranslateModule } from '@ngx-translate/core';
import { MatChipsModule } from '@angular/material/chips';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { KrModalModule } from './../../shared/kr-modal/kr-modal.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddFaqComponent } from './add-faq.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@NgModule({
  declarations: [AddFaqComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    KrModalModule,
    PerfectScrollbarModule,
    MatChipsModule,
    TranslateModule,
    CodemirrorModule,
    FormsModule,
    MatIconModule,
    NgxDaterangepickerMd,
    NgbTooltipModule,
    SharedPipesModule,
    AddAlternateQuestionModule,
    MatFormFieldModule
  ],
  exports: [AddFaqComponent],
})
export class AddFaqModule {}
