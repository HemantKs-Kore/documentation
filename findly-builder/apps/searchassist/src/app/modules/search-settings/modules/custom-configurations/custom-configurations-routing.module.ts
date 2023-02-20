import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomConfigurationsComponent } from './custom-configurations.component';

const routes: Routes = [{ path: '', component: CustomConfigurationsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomConfigurationsRoutingModule {}
