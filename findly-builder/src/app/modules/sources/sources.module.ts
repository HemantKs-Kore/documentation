import { SchedulerModule } from './../../components/scheduler/scheduler.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { KrModalModule } from './../../shared/kr-modal/kr-modal.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SourcesRoutingModule } from './sources-routing.module';
import { SourcesComponent } from './sources.component';


@NgModule({
  declarations: [SourcesComponent],
  imports: [
    CommonModule,
    SourcesRoutingModule,
    PerfectScrollbarModule,

    // for modals - NR
    KrModalModule,
    TranslateModule,
    FormsModule,
    SchedulerModule,
    TranslateModule
  ],
})
export class SourcesModule {}
