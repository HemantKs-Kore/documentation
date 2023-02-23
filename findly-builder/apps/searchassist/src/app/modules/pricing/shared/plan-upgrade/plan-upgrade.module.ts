import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PlanUpgradeComponent } from './plan-upgrade.component';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { KrModalModule } from './../../../../shared/kr-modal/kr-modal.module';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SharedPipesModule } from '../../../../helpers/filters/shared-pipes.module';

@NgModule({
  declarations: [PlanUpgradeComponent],
  imports: [
    CommonModule,
    NgbDropdownModule,
    KrModalModule,
    PerfectScrollbarModule,
    TranslateModule,
    NgbTooltipModule,
    SharedPipesModule,
    FormsModule,
    NgOptimizedImage,
  ],
  exports: [PlanUpgradeComponent],
})
export class PlanUpgradeModule {}
