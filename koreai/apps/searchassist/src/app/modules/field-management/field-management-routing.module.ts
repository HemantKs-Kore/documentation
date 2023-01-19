import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FieldManagementComponent } from './field-management.component';

const routes: Routes = [{ path: '', component: FieldManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FieldManagementRoutingModule {}
