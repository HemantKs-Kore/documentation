import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HighlightingComponent } from './highlighting.component';

const routes: Routes = [{ path: '', component: HighlightingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HighlightingRoutingModule { }
