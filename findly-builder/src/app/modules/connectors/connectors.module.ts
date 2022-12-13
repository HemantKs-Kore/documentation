import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConnectorsRoutingModule } from './connectors-routing.module';
import { ConnectorsComponent } from './connectors.component';


@NgModule({
  declarations: [ConnectorsComponent],
  imports: [
    CommonModule,
    ConnectorsRoutingModule
  ]
})
export class ConnectorsModule { }
