import { SharedPipesModule } from './../../helpers/filters/shared-pipes.module';
import { UseronboardingJourneyModule } from './../../helpers/components/useronboarding-journey/useronboarding-journey.module';
import { RecordPaginationModule } from './../../helpers/components/record-pagination/record-pagination.module';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import {
  NgbDropdownModule,
  NgbTooltipModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { EmptyScreenModule } from './../empty-screen/empty-screen.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddStructuredDataModule } from './../../components/add-structured-data/add-structured-data.module';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { StructuredDataStatusModalModule } from './../../components/structured-data-status-modal/structured-data-status-modal.module';
import { KrModalModule } from './../../shared/kr-modal/kr-modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StructuredDataRoutingModule } from './structured-data-routing.module';
import { StructuredDataComponent } from './structured-data.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [StructuredDataComponent],
  imports: [
    CommonModule,
    StructuredDataRoutingModule,
    KrModalModule,
    StructuredDataStatusModalModule,
    TranslateModule,
    PerfectScrollbarModule,
    FormsModule,
    AddStructuredDataModule,
    MatProgressSpinnerModule,
    EmptyScreenModule,
    NgbDropdownModule,
    CodemirrorModule,
    NgbTooltipModule,
    RecordPaginationModule,
    NgbTypeaheadModule,
    UseronboardingJourneyModule,
    SharedPipesModule,
    MatDialogModule,
  ],
  exports: [StructuredDataComponent],
})
export class StructuredDataModule {}
