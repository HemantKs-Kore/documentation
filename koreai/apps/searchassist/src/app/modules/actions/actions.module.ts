import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionsRoutingModule } from './actions-routing.module';
import { ActionsComponent } from './actions.component';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ActionsComponent],
  imports: [
    CommonModule,
    ActionsRoutingModule,
    NgbDropdownModule,
    NgbTooltipModule,
    TranslateModule,
    FormsModule,
  ],
})
export class ActionsModule {}
