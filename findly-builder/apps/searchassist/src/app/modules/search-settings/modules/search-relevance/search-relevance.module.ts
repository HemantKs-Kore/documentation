import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRelevanceRoutingModule } from './search-relevance-routing.module';
import { SearchRelevanceComponent } from './search-relevance.component';
import { FindlySharedModule } from '../../../findly-shared/findly-shared.module';


@NgModule({
  declarations: [SearchRelevanceComponent],
  imports: [
    CommonModule,
    SearchRelevanceRoutingModule,
    FindlySharedModule
  ]
})
export class SearchRelevanceModule { }
