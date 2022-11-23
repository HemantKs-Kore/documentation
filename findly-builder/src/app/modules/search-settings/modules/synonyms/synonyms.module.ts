import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SynonymsRoutingModule } from './synonyms-routing.module';
import { SynonymsComponent } from './synonyms.component';


@NgModule({
  declarations: [SynonymsComponent],
  imports: [
    CommonModule,
    SynonymsRoutingModule
  ]
})
export class SynonymsModule { }
