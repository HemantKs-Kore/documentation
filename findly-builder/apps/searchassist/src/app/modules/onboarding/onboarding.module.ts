import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { OnboardingComponent } from '../onboarding/onboarding.component';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipe } from '@kore.apps/shared/pipes/safe.pipe';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { IntersectionObserverDirectiveModule } from '@kore.libs/shared/src';

@NgModule({
  declarations: [OnboardingComponent],
  imports: [
    CommonModule,
    FormsModule,
    PerfectScrollbarModule,
    RouterModule,
    TranslateModule.forChild(),
    SafePipe,
    SharedPipesModule,
    NgOptimizedImage,
    IntersectionObserverDirectiveModule,
  ],
  providers: [SafePipe],
  exports: [OnboardingComponent],
})
export class OnboardingModule {}
