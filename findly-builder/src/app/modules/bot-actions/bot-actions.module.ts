import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BotActionsRoutingModule } from './bot-actions-routing.module';
import { BotActionsComponent } from './bot-actions.component';


@NgModule({
  declarations: [BotActionsComponent],
  imports: [
    CommonModule,
    BotActionsRoutingModule
  ]
})
export class BotActionsModule { }
