import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRulesRoutingModule } from './business-rules-routing.module';
import { BusinessRulesComponent } from './business-rules.component';
import { TranslateModule } from '@ngx-translate/core';
import { UpgradePlanModule } from '@kore.helpers/components/upgrade-plan/upgrade-plan.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UseronboardingJourneyModule } from '@kore.helpers/components/useronboarding-journey/useronboarding-journey.module';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [BusinessRulesComponent],
  imports: [
    CommonModule,
    BusinessRulesRoutingModule,
    TranslateModule,
    UpgradePlanModule,
    PerfectScrollbarModule,
    KrModalModule,
    NgbTooltipModule,
    UseronboardingJourneyModule,
    FormsModule,
    MatDialogModule,
  ],
})
export class BusinessRulesModule {}
