import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StopWordsComponent } from './stop-words.component';

const routes: Routes = [{ path: '', component: StopWordsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StopWordsRoutingModule {}
