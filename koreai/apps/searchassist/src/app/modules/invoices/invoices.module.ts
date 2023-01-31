import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoicesComponent } from './invoices.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { UseronboardingJourneyModule } from '@kore.apps/helpers/components/useronboarding-journey/useronboarding-journey.module';
import { FieldsFilterPipe } from '@kore.apps/shared/pipes/fields-filter.pipe';

@NgModule({
  declarations: [InvoicesComponent],
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    NgbTooltipModule,
    TranslateModule,
    UseronboardingJourneyModule,
    FieldsFilterPipe,
  ],
})
export class InvoicesModule {}
