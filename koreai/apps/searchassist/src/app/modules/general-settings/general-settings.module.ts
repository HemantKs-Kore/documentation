import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralSettingsRoutingModule } from './general-settings-routing.module';
import { GeneralSettingsComponent } from './general-settings.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { UseronboardingJourneyModule } from '@kore.helpers/components/useronboarding-journey/useronboarding-journey.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ActionsModule } from '../actions/actions.module';

@NgModule({
  declarations: [GeneralSettingsComponent],
  imports: [
    CommonModule,
    GeneralSettingsRoutingModule,
    PerfectScrollbarModule,
    TranslateModule,
    UseronboardingJourneyModule,
    NgbTooltipModule,
    ActionsModule,
  ],
})
export class GeneralSettingsModule {}
