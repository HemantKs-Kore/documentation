import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  NgbActiveModal,
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SliderComponentComponent } from '../../../shared/slider-component/slider-component.component';
import { FormsModule } from '@angular/forms';
import { KrModalModule } from '../../../shared/kr-modal/kr-modal.module';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { OnboardingModule } from '@kore.apps/modules/onboarding/onboarding.module';

@NgModule({
  declarations: [HeaderComponent, SliderComponentComponent],
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
  ],
  providers: [AppSelectionService, NgbActiveModal],
  exports: [HeaderComponent],
})
export class HeaderModule {}
