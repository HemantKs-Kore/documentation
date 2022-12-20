import { AddAlternateQuestionModule } from './../../components/faqs/add-alternate-question/add-alternate-question.module';
import { FindlySharedModule } from 'src/app/modules/findly-shared/findly-shared.module';
import { SourcesModule } from './../sources/sources.module';
import { AddFaqModule } from './../../components/add-faq/add-faq.module';
import { EmptyScreenModule } from './../empty-screen/empty-screen.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { KrModalModule } from './../../shared/kr-modal/kr-modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqsRoutingModule } from './faqs-routing.module';
import { FaqsComponent } from './faqs.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [FaqsComponent],
  imports: [
    CommonModule,
    FaqsRoutingModule,
    KrModalModule,
    TranslateModule,
    PerfectScrollbarModule,
    EmptyScreenModule,
    AddFaqModule,
    SourcesModule,
    FindlySharedModule,
    DragDropModule,
    AddAlternateQuestionModule
  ]
})
export class FaqsModule { }
