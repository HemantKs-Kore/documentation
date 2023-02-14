import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsightsComponent } from './insights.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [InsightsComponent],
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgxEchartsModule.forChild(),
    PerfectScrollbarModule,
  ],
  exports: [InsightsComponent],
})
export class InsightsModule {}
