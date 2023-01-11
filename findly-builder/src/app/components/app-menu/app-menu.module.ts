import { SharedPipesModule } from './../../helpers/filters/shared-pipes.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { KrModalModule } from './../../shared/kr-modal/kr-modal.module';
import { UpgradePlanModule } from './../../helpers/components/upgrade-plan/upgrade-plan.module';
import { AppMenuComponent } from './app-menu.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AppMenuComponent],
  imports: [
    CommonModule,
    UpgradePlanModule,
    KrModalModule,
    PerfectScrollbarModule,
    TranslateModule,
    FormsModule,
    RouterModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    SharedPipesModule
  ],
  exports: [AppMenuComponent],
})
export class AppMenuModule {}
