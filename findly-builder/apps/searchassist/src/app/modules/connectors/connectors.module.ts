import { UseronboardingJourneyModule } from './../../helpers/components/useronboarding-journey/useronboarding-journey.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule } from './../../helpers/filters/shared-pipes.module';
import { FormsModule } from '@angular/forms';
import { EmptyScreenModule } from './../empty-screen/empty-screen.module';
import { RecordPaginationModule } from './../../helpers/components/record-pagination/record-pagination.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { KrModalModule } from './../../shared/kr-modal/kr-modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConnectorsRoutingModule } from './connectors-routing.module';
import { ConnectorsComponent } from './connectors.component';
import { ConnectorInputComponent } from './shared/connector-input/connector-input.component';

@NgModule({
  declarations: [ConnectorsComponent, ConnectorInputComponent],
  imports: [
    CommonModule,
    ConnectorsRoutingModule,
    KrModalModule,
    TranslateModule.forChild(),
    PerfectScrollbarModule,
    RecordPaginationModule,
    EmptyScreenModule,
    FormsModule,
    SharedPipesModule,
    NgbTooltipModule,
    MatProgressSpinnerModule,
    UseronboardingJourneyModule,
  ],
})
export class ConnectorsModule {}
