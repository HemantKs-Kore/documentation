import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SliderComponentComponent } from '../../../shared/slider-component/slider-component.component';
import { FormsModule } from '@angular/forms';
import { KrModalModule } from '../../../shared/kr-modal/kr-modal.module';
import { SafePipe } from '../../../shared/pipes/safe.pipe';
import { OnboardingComponentComponent } from '@kore.apps/components/onboarding-component/onboarding-component.component';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';

@NgModule({
  declarations: [
    HeaderComponent,
    OnboardingComponentComponent,
    SliderComponentComponent,
  ],
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
    SafePipe,
  ],
  providers: [SafePipe],
  exports: [HeaderComponent],
})
export class HeaderModule {}
