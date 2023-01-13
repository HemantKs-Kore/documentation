import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmallTalkRoutingModule } from './small-talk-routing.module';
import { SmallTalkComponent } from './small-talk.component';
import { FindlySharedModule } from '../../../findly-shared/findly-shared.module';


@NgModule({
  declarations: [SmallTalkComponent],
  imports: [
    CommonModule,
    SmallTalkRoutingModule,
    FindlySharedModule
  ],
  exports: [
    SmallTalkComponent
  ]
})
export class SmallTalkModule { }
