import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { KrModalModule } from './../../../shared/kr-modal/kr-modal.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { UseronboardingJourneyComponent } from './useronboarding-journey.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [UseronboardingJourneyComponent],
  imports: [
    CommonModule,
    NgbDropdownModule,
    KrModalModule,
    PerfectScrollbarModule,
    TranslateModule
  ],
  exports: [UseronboardingJourneyComponent],
})
export class UseronboardingJourneyModule {}
