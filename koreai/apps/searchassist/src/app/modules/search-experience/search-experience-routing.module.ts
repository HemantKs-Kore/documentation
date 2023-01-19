import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchExperienceComponent } from './search-experience.component';

const routes: Routes = [{ path: '', component: SearchExperienceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchExperienceRoutingModule { }
