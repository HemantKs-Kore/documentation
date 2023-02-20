import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppExperimentsComponent } from './app-experiments.component';

const routes: Routes = [{ path: '', component: AppExperimentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppExperimentsRoutingModule { }
