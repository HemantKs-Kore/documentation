import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UseronboardingJourneyComponent } from '../../helpers/components/useronboarding-journey/useronboarding-journey.component';

@NgModule({
  declarations: [
    UseronboardingJourneyComponent
  ],
  imports: [
    CommonModule,
    
  ],
  exports: [
    UseronboardingJourneyComponent
  ]
})
export class SearchSettingsSharedModule { }
