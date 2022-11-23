import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HighlightingRoutingModule } from './highlighting-routing.module';
import { HighlightingComponent } from './highlighting.component';


@NgModule({
  declarations: [HighlightingComponent],
  imports: [
    CommonModule,
    HighlightingRoutingModule
  ]
})
export class HighlightingModule { }
