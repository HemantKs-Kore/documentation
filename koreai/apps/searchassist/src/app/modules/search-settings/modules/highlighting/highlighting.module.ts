import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HighlightingRoutingModule } from './highlighting-routing.module';
import { HighlightingComponent } from './highlighting.component';
import { FindlySharedModule } from 'src/app/modules/findly-shared/findly-shared.module';


@NgModule({
  declarations: [HighlightingComponent],
  imports: [
    CommonModule,
    HighlightingRoutingModule,
    FindlySharedModule
  ]
})
export class HighlightingModule { }
