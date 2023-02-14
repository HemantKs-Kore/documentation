import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BotActionsComponent } from './bot-actions.component';

const routes: Routes = [{ path: '', component: BotActionsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BotActionsRoutingModule { }
