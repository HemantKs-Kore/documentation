import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MainMenuComponent } from './mainmenu.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { UpgradePlanModule } from '@kore.helpers/components/upgrade-plan/upgrade-plan.module';
import { KrModalModule } from '../../../shared/kr-modal/kr-modal.module';
import { SharedPipesModule } from '@kore.helpers/filters/shared-pipes.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [MainMenuComponent],
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
    SharedPipesModule,
    MatDialogModule,
  ],
  exports: [MainMenuComponent],
})
export class MainMenuModule {}
