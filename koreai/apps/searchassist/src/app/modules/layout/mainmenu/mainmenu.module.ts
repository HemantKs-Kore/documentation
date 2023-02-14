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
import { KrModalModule } from '../../../shared/kr-modal/kr-modal.module';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { ConfirmationDialogComponent } from '@kore.apps/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { PlanUpgradeModule } from '../../../modules/pricing/shared/plan-upgrade/plan-upgrade.module';

@NgModule({
  declarations: [MainMenuComponent, ConfirmationDialogComponent],
  imports: [
    CommonModule,
    PlanUpgradeModule,
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
  entryComponents: [ConfirmationDialogComponent],
  exports: [MainMenuComponent],
})
export class MainMenuModule { }
