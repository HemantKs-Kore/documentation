import { NgModule } from '@angular/core';
import { EmptyScreenModule } from '../empty-screen/empty-screen.module';
import { PricingRoutingModule } from './pricing-routing.module';
import { SharedPipesModule } from '../../helpers/filters/shared-pipes.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { KrModalModule } from './../../shared/kr-modal/kr-modal.module';
import { PlanUpgradeModule } from './shared/plan-upgrade/plan-upgrade.module';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { RecordPaginationModule } from '../../helpers/components/record-pagination/record-pagination.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UseronboardingJourneyModule } from '@kore.apps/helpers/components/useronboarding-journey/useronboarding-journey.module';

import * as echarts from 'echarts';
import { PlanDetailsComponent } from './plan-details/plan-details.component';
import { UsageLogsComponent } from './usage-logs/usage-logs.component';
import { InvoicesComponent } from './invoices/invoices.component';

@NgModule({
  declarations: [PlanDetailsComponent, UsageLogsComponent, InvoicesComponent],
  imports: [
    PricingRoutingModule,
    EmptyScreenModule,
    NgxEchartsModule.forChild(),
    SharedPipesModule,
    KrModalModule,
    PlanUpgradeModule,
    NgbTooltipModule,
    NgbDropdownModule,
    RecordPaginationModule,
    TranslateModule.forChild(),
    PerfectScrollbarModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UseronboardingJourneyModule,
  ],
})
export class PricingModule {}
