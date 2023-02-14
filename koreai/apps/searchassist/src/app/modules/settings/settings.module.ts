import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { EmptyScreenModule } from '../empty-screen/empty-screen.module';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    TranslateModule,
    FormsModule,
    KrModalModule,
    PerfectScrollbarModule,
    SharedPipesModule,
    NgbDropdownModule,
    MatDialogModule,
    EmptyScreenModule,
    NgbTooltipModule,
  ],
})
export class SettingsModule {}
