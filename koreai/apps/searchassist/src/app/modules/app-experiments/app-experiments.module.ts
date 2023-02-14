import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppExperimentsRoutingModule } from './app-experiments-routing.module';
import { AppExperimentsComponent } from './app-experiments.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { EmptyScreenModule } from '../empty-screen/empty-screen.module';
import { NouisliderModule } from 'ng2-nouislider';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AppExperimentsComponent],
  imports: [
    CommonModule,
    AppExperimentsRoutingModule,
    TranslateModule.forChild(),
    FormsModule,
    PerfectScrollbarModule,
    KrModalModule,
    MatDialogModule,
    NgxDaterangepickerMd,
    SharedPipesModule,
    EmptyScreenModule,
    NouisliderModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbProgressbarModule,
  ],
})
export class AppExperimentsModule {}
