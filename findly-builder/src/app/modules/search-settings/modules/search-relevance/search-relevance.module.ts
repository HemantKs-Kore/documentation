import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRelevanceRoutingModule } from './search-relevance-routing.module';
import { SearchRelevanceComponent } from './search-relevance.component';


@NgModule({
  declarations: [SearchRelevanceComponent],
  imports: [
    CommonModule,
    SearchRelevanceRoutingModule
  ]
})
export class SearchRelevanceModule { }
