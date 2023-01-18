import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppExperimentsRoutingModule } from './app-experiments-routing.module';
import { AppExperimentsComponent } from './app-experiments.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [AppExperimentsComponent],
  imports: [
    CommonModule,
    AppExperimentsRoutingModule,
    TranslateModule,
    FormsModule,
    PerfectScrollbarModule,
    KrModalModule,
    MatDialogModule,
  ],
})
export class AppExperimentsModule {}
