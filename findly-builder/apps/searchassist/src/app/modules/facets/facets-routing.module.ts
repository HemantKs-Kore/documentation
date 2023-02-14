import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacetsComponent } from './facets.component';

const routes: Routes = [{ path: '', component: FacetsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacetsRoutingModule {}
