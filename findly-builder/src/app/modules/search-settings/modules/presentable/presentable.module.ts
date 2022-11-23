import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresentableRoutingModule } from './presentable-routing.module';
import { PresentableComponent } from './presentable.component';


@NgModule({
  declarations: [PresentableComponent],
  imports: [
    CommonModule,
    PresentableRoutingModule
  ]
})
export class PresentableModule { }
