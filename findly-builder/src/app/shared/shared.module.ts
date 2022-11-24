import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponentComponent } from './slider-component/slider-component.component';
import { SearchSettingsSharedModule } from '../modules/search-settings-shared/search-settings-shared.module';

const COMPONENTS = [
  SliderComponentComponent
];

@NgModule({
  declarations: [
    SliderComponentComponent,
  ],
  imports: [
    CommonModule,
    SearchSettingsSharedModule
  ],
  exports: [
    SliderComponentComponent,
    
  ],
})
export class SharedModule { }
