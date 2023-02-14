import { SharedPipesModule } from './../../filters/shared-pipes.module';
import { FormsModule } from '@angular/forms';
import { KrModalModule } from './../../../shared/kr-modal/kr-modal.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { UpgradePlanComponent } from './upgrade-plan.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [UpgradePlanComponent],
  imports: [
    CommonModule,
    TranslateModule,
    NgbTooltipModule,
    PerfectScrollbarModule,
    KrModalModule,
    FormsModule,
    SharedPipesModule
  ],
  exports: [UpgradePlanComponent],
})
export class UpgradePlanModule {}
