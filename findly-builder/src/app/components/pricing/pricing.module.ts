import { NgxEchartsModule } from 'ngx-echarts';
import { SharedPipesModule } from './../../helpers/filters/shared-pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { KrModalModule } from './../../shared/kr-modal/kr-modal.module';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { UpgradePlanModule } from './../../helpers/components/upgrade-plan/upgrade-plan.module';
import { PricingComponent } from './pricing.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [PricingComponent],
  imports: [
    CommonModule,
    UpgradePlanModule,
    PerfectScrollbarModule,
    TranslateModule,
    KrModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    MatProgressSpinnerModule,
    SharedPipesModule,
    NgxEchartsModule
  ],
  exports: [PricingComponent]
})
export class PricingModule { }
