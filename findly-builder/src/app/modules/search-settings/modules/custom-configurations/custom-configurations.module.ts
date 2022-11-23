import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomConfigurationsRoutingModule } from './custom-configurations-routing.module';
import { CustomConfigurationsComponent } from './custom-configurations.component';


@NgModule({
  declarations: [CustomConfigurationsComponent],
  imports: [
    CommonModule,
    CustomConfigurationsRoutingModule
  ]
})
export class CustomConfigurationsModule { }
