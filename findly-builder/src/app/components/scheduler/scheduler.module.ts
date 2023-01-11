import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { KrModalModule } from './../../shared/kr-modal/kr-modal.module';
import { SchedulerComponent } from './scheduler.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SchedulerComponent],
  imports: [
    CommonModule,
    KrModalModule,
    PerfectScrollbarModule,
    MatDatepickerModule,
    FormsModule,
    MatCardModule
  ],
  exports: [SchedulerComponent],
})
export class SchedulerModule {}
