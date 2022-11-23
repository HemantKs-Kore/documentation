import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StopWordsRoutingModule } from './stop-words-routing.module';
import { StopWordsComponent } from './stop-words.component';


@NgModule({
  declarations: [StopWordsComponent],
  imports: [
    CommonModule,
    StopWordsRoutingModule
  ]
})
export class StopWordsModule { }
