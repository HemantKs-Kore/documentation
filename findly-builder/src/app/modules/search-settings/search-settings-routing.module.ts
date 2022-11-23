import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchSettingsComponent } from './search-settings.component';

const routes: Routes = [
  { 
    path: '', 
    component: SearchSettingsComponent,
    children: [
    { path: 'weights', loadChildren: () => import('./modules/weights/weights.module').then(m => m.WeightsModule) }, 
    { path: 'presentable', loadChildren: () => import('./modules/presentable/presentable.module').then(m => m.PresentableModule) },
    //  {
    //   path: '', redirectTo: 'weights', pathMatch: 'full'
    //  } 
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchSettingsRoutingModule { }
