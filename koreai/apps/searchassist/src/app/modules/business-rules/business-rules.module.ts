import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRulesRoutingModule } from './business-rules-routing.module';
import { BusinessRulesComponent } from './business-rules.component';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { UpgradePlanModule } from '@kore.apps/helpers/components/upgrade-plan/upgrade-plan.module';
import { UseronboardingJourneyModule } from '@kore.apps/helpers/components/useronboarding-journey/useronboarding-journey.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@NgModule({
  declarations: [BusinessRulesComponent],
  imports: [
    CommonModule,
    BusinessRulesRoutingModule,
    TranslateModule.forChild(),
    UpgradePlanModule,
    PerfectScrollbarModule,
    KrModalModule,
    NgbTooltipModule,
    UseronboardingJourneyModule,
    FormsModule,
    MatDialogModule,
    NgxDaterangepickerMd.forRoot(),
  ],
})
export class BusinessRulesModule {}
