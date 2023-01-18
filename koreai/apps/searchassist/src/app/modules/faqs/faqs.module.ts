import { UseronboardingJourneyModule } from './../../helpers/components/useronboarding-journey/useronboarding-journey.module';
import { FormsModule } from '@angular/forms';
import { RecordPaginationModule } from './../../helpers/components/record-pagination/record-pagination.module';
import { SharedPipesModule } from './../../helpers/filters/shared-pipes.module';
import {
  NgbTooltipModule,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddAlternateQuestionModule } from './../../components/faqs/add-alternate-question/add-alternate-question.module';
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
    TranslateModule.forChild(),
    PerfectScrollbarModule,
    EmptyScreenModule,
    AddFaqModule,
    SourcesModule,
    DragDropModule,
    AddAlternateQuestionModule,
    MatProgressSpinnerModule,
    NgbTooltipModule,
    PerfectScrollbarModule,
    SharedPipesModule,
    NgbDropdownModule,
    RecordPaginationModule,
    FormsModule,
    UseronboardingJourneyModule,
  ],
})
export class FaqsModule {}
