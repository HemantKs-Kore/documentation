import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StructuredDataRoutingModule } from './structured-data-routing.module';
import { StructuredDataComponent } from './structured-data.component';


@NgModule({
  declarations: [StructuredDataComponent],
  imports: [CommonModule, StructuredDataRoutingModule],
  exports: [StructuredDataComponent],
})
export class StructuredDataModule {}
