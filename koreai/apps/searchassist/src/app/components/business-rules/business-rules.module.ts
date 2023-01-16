import { EmptyScreenModule } from './../../modules/empty-screen/empty-screen.module';
import { FindlySharedModule } from '../../modules/findly-shared/findly-shared.module';
import { RangeSliderModule } from './../../helpers/components/range-slider/range-slider.module';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { FormsModule } from '@angular/forms';
import { SharedPipesModule } from './../../helpers/filters/shared-pipes.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { KrModalModule } from './../../shared/kr-modal/kr-modal.module';
import { UpgradePlanModule } from './../../helpers/components/upgrade-plan/upgrade-plan.module';
import { BusinessRulesComponent } from './business-rules.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SelectTextDirective } from '../../helpers/directives/select-text.directive';

@NgModule({
  declarations: [BusinessRulesComponent,
    SelectTextDirective],
  imports: [
    CommonModule,
    UpgradePlanModule,
    KrModalModule,
    PerfectScrollbarModule,
    TranslateModule,
    SharedPipesModule,
    FormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    NgbDropdownModule,
    NgbTooltipModule,
    RangeSliderModule,
    NgxDaterangepickerMd,
    FindlySharedModule,
    EmptyScreenModule

  ],
  exports: [BusinessRulesComponent],
})
export class BusinessRulesModule {}
