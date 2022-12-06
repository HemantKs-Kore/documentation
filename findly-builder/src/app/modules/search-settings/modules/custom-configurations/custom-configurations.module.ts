import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomConfigurationsRoutingModule } from './custom-configurations-routing.module';
import { CustomConfigurationsComponent } from './custom-configurations.component';
import { FindlySharedModule } from 'src/app/modules/findly-shared/findly-shared.module';


@NgModule({
  declarations: [CustomConfigurationsComponent],
  imports: [
    CommonModule,
    CustomConfigurationsRoutingModule,
    FindlySharedModule
  ]
})
export class CustomConfigurationsModule { }
