import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresentableComponent } from './presentable.component';

const routes: Routes = [{ path: '', component: PresentableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PresentableRoutingModule {}
