import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexConfigurationSettingsRoutingModule } from './index-configuration-settings-routing.module';
import { IndexConfigurationSettingsComponent } from './index-configuration-settings.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedPipesModule } from '@kore.helpers/filters/shared-pipes.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [IndexConfigurationSettingsComponent],
  imports: [
    CommonModule,
    IndexConfigurationSettingsRoutingModule,
    PerfectScrollbarModule,
    KrModalModule,
    TranslateModule,
    SharedPipesModule,
    NgbTooltipModule,
    FormsModule,
  ],
})
export class IndexConfigurationSettingsModule {}
