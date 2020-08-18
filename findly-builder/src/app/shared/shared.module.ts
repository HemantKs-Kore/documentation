import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponentComponent } from './slider-component/slider-component.component';

const COMPONENTS = [
  SliderComponentComponent
];

@NgModule({
  declarations: [
    SliderComponentComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SliderComponentComponent
  ],
})
export class SharedModule { }
