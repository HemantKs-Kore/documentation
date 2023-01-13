import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchRelevanceComponent } from './search-relevance.component';

const routes: Routes = [{ path: '', component: SearchRelevanceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRelevanceRoutingModule { }
