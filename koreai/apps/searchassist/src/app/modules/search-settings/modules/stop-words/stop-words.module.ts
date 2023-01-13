import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StopWordsRoutingModule } from './stop-words-routing.module';
import { StopWordsComponent } from './stop-words.component';
import { FindlySharedModule } from '../../modules/findly-shared/findly-shared.module';


@NgModule({
  declarations: [StopWordsComponent],
  imports: [
    CommonModule,
    StopWordsRoutingModule,
    FindlySharedModule,
  ]
})
export class StopWordsModule { }
