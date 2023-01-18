import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetricsRoutingModule } from './metrics-routing.module';
import { MetricsComponent } from './metrics.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [MetricsComponent],
  imports: [CommonModule, MetricsRoutingModule, PerfectScrollbarModule],
})
export class MetricsModule {}
