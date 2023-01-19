import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultTemplatesRoutingModule } from './result-templates-routing.module';
import { ResultTemplatesComponent } from './result-templates.component';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { FormsModule } from '@angular/forms';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ResultTemplatesComponent],
  imports: [
    CommonModule,
    ResultTemplatesRoutingModule,
    TranslateModule,
    PerfectScrollbarModule,
    KrModalModule,
    FormsModule,
    NgbTooltipModule,
    NgbDropdownModule,
  ],
})
export class ResultTemplatesModule {}
