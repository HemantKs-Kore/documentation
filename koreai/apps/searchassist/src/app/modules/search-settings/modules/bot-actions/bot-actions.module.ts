import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BotActionsRoutingModule } from './bot-actions-routing.module';
import { BotActionsComponent } from './bot-actions.component';
import { FindlySharedModule } from '../../modules/findly-shared/findly-shared.module';



@NgModule({
  declarations: [BotActionsComponent],
  imports: [
    CommonModule,
    BotActionsRoutingModule,
    FindlySharedModule
  ]
})
export class BotActionsModule { }
