import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpellCorrectionComponent } from './spell-correction.component';

const routes: Routes = [{ path: '', component: SpellCorrectionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpellCorrectionRoutingModule { }
