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
import { UpgradePlanModule } from '@kore.apps/helpers/components/upgrade-plan/upgrade-plan.module';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { ConfirmationDialogComponent } from '@kore.apps/helpers/components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [MainMenuComponent, ConfirmationDialogComponent],
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
  entryComponents: [ConfirmationDialogComponent],
  exports: [MainMenuComponent],
})
export class MainMenuModule {}
