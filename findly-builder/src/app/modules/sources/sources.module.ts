import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule } from './../../helpers/filters/shared-pipes.module';
import { UpgradePlanModule } from './../../helpers/components/upgrade-plan/upgrade-plan.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StructuredDataStatusModalModule } from './../../components/structured-data-status-modal/structured-data-status-modal.module';
import { AddStructuredDataModule } from './../../components/add-structured-data/add-structured-data.module';
import { AddFaqModule } from './../../components/add-faq/add-faq.module';
import { SchedulerModule } from './../../components/scheduler/scheduler.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { KrModalModule } from './../../shared/kr-modal/kr-modal.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SourcesRoutingModule } from './sources-routing.module';
import { SourcesComponent } from './sources.component';


@NgModule({
  declarations: [SourcesComponent],
  imports: [
    CommonModule,
    MatProgressBarModule,
    SourcesRoutingModule,
    PerfectScrollbarModule,

    // for modals - NR
    KrModalModule,
    TranslateModule,
    FormsModule,
    SchedulerModule,
    TranslateModule,

    // add faq modal
    AddFaqModule,
    AddStructuredDataModule,
    StructuredDataStatusModalModule,
    UpgradePlanModule,
    SharedPipesModule,
    NgbTooltipModule
  ],
})
export class SourcesModule {}
