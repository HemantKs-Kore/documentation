import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsageLogComponent } from './usage-log.component';

const routes: Routes = [{ path: '', component: UsageLogComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsageLogRoutingModule {}
