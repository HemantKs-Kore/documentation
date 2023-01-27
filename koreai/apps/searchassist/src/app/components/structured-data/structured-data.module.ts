import { StructuredDataStatusModalModule } from '../structured-data-status-modal/structured-data-status-modal.module';
import { StructuredDataComponent } from './structured-data.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingModule } from '@kore.apps/modules/onboarding/onboarding.module';

@NgModule({
  declarations: [StructuredDataComponent],
  imports: [CommonModule, StructuredDataStatusModalModule, OnboardingModule],
  exports: [StructuredDataComponent],
})
export class StructuredDataModule {}
