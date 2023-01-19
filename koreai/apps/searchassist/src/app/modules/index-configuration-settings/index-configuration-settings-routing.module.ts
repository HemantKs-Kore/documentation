import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexConfigurationSettingsComponent } from './index-configuration-settings.component';

const routes: Routes = [{ path: '', component: IndexConfigurationSettingsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexConfigurationSettingsRoutingModule { }
