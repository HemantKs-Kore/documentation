import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRulesRoutingModule } from './business-rules-routing.module';
import { BusinessRulesComponent } from './business-rules.component';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { UpgradePlanModule } from '@kore.apps/helpers/components/upgrade-plan/upgrade-plan.module';
import { UseronboardingJourneyModule } from '@kore.apps/helpers/components/useronboarding-journey/useronboarding-journey.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RangeSliderModule } from '@kore.apps/helpers/components/range-slider/range-slider.module';
import { EmptyScreenModule } from '../empty-screen/empty-screen.module';

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
    MatChipsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    NgbDropdownModule,
    RangeSliderModule,
    NgxDaterangepickerMd,
    SharedPipesModule,
    NgxDaterangepickerMd.forRoot(),
    EmptyScreenModule,
  ],
})
export class BusinessRulesModule {}
