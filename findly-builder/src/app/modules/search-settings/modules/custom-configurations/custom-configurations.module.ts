import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomConfigurationsRoutingModule } from './custom-configurations-routing.module';
import { CustomConfigurationsComponent } from './custom-configurations.component';
import { FindlySharedModule } from 'src/app/modules/findly-shared/findly-shared.module';
import { CustomConfigFormComponent } from './components/custom-config-form/custom-config-form.component';
import { CustomConfigListComponent } from './components/custom-config-list/custom-config-list.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [CustomConfigurationsComponent, CustomConfigFormComponent, CustomConfigListComponent],
  imports: [
    CommonModule,
    CustomConfigurationsRoutingModule,
    FindlySharedModule,
    FormsModule
  ]
})
export class CustomConfigurationsModule { }
