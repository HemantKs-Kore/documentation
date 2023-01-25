import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SynonymsComponent } from './synonyms.component';

const routes: Routes = [{ path: '', component: SynonymsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SynonymsRoutingModule {}
