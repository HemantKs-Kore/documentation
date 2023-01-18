import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserEngagementComponent } from './user-engagement.component';

const routes: Routes = [{ path: '', component: UserEngagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserEngagementRoutingModule { }
