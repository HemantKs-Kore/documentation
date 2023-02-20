import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from './header.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  NgbActiveModal,
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { KrModalModule } from '../../../shared/kr-modal/kr-modal.module';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { OnboardingModule } from '@kore.apps/modules/onboarding/onboarding.module';
import { SliderModule } from '@kore.apps/shared/slider-component/slider.module';
import { IntersectionObserverDirectiveModule } from '@kore.libs/shared/src';
@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    NgbProgressbarModule,
    PerfectScrollbarModule,
    FormsModule,
    KrModalModule,
    NgbTooltipModule,
    NgbDropdownModule,
    SharedPipesModule,
    OnboardingModule,
    NgbTypeaheadModule,
    SliderModule,
    IntersectionObserverDirectiveModule,
    NgOptimizedImage,
  ],
  providers: [AppSelectionService, NgbActiveModal],
  exports: [HeaderComponent],
})
export class HeaderModule {}
