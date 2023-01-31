import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralSettingsRoutingModule } from './general-settings-routing.module';
import { GeneralSettingsComponent } from './general-settings.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ActionsModule } from '../actions/actions.module';
import { UseronboardingJourneyModule } from '@kore.apps/helpers/components/useronboarding-journey/useronboarding-journey.module';
import { EmptyScreenModule } from '../empty-screen/empty-screen.module';

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
    EmptyScreenModule,
  ],
})
export class GeneralSettingsModule {}
