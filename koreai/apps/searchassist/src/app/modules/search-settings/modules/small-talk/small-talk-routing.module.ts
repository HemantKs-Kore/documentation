import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SmallTalkComponent } from './small-talk.component';

const routes: Routes = [{ path: '', component: SmallTalkComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmallTalkRoutingModule {}
