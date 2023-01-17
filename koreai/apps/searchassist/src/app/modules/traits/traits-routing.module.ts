import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TraitsComponent } from './traits.component';

const routes: Routes = [{ path: '', component: TraitsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TraitsRoutingModule { }
