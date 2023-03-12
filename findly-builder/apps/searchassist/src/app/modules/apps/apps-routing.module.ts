import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppsComponent } from './apps.component';
import { AppsDataResolver } from './services/apps-data.resolver';

const routes: Routes = [
  { path: '', component: AppsComponent, resolve: [AppsDataResolver] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppsRoutingModule {}
