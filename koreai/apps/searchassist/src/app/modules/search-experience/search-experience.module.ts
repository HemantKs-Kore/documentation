import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchExperienceRoutingModule } from './search-experience-routing.module';
import { SearchExperienceComponent } from './search-experience.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { TranslateModule } from '@ngx-translate/core';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { UseronboardingJourneyModule } from '@kore.apps/helpers/components/useronboarding-journey/useronboarding-journey.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SearchExperienceComponent],
  imports: [
    CommonModule,
    SearchExperienceRoutingModule,
    PerfectScrollbarModule,
    KrModalModule,
    TranslateModule,
    UseronboardingJourneyModule,
    NgbTooltipModule,
    PickerModule,
    NgbDropdownModule,
    ColorPickerModule,
    FormsModule,
  ],
})
export class SearchExperienceModule {}
