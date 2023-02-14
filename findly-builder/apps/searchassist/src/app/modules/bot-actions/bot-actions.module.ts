import { UseronboardingJourneyModule } from './../../helpers/components/useronboarding-journey/useronboarding-journey.module';
import { SharedPipesModule } from './../../helpers/filters/shared-pipes.module';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { EmptyScreenModule } from './../empty-screen/empty-screen.module';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { KrModalModule } from './../../shared/kr-modal/kr-modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BotActionsRoutingModule } from './bot-actions-routing.module';
import { BotActionsComponent } from './bot-actions.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { OnboardingModule } from '../onboarding/onboarding.module';

@NgModule({
  declarations: [BotActionsComponent],
  imports: [
    CommonModule,
    BotActionsRoutingModule,
    KrModalModule,
    TranslateModule.forChild(),
    PerfectScrollbarModule,
    FormsModule,
    EmptyScreenModule,
    NgbTooltipModule,
    SharedPipesModule,
    NgbDropdownModule,
    MatProgressSpinnerModule,
    UseronboardingJourneyModule,
    MatDialogModule,
    OnboardingModule,
  ],
  providers: [],
})
export class BotActionsModule {}
