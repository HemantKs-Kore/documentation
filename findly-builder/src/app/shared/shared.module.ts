import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponentComponent } from './slider-component/slider-component.component';
import { KRModalComponent } from './kr-modal/kr-modal.component';

const COMPONENTS = [
  SliderComponentComponent
];

@NgModule({
  declarations: [
    SliderComponentComponent,
    KRModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SliderComponentComponent,
    KRModalComponent
  ],
})
export class SharedModule { }
