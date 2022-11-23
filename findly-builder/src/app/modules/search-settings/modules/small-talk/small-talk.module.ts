import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmallTalkRoutingModule } from './small-talk-routing.module';
import { SmallTalkComponent } from './small-talk.component';


@NgModule({
  declarations: [SmallTalkComponent],
  imports: [
    CommonModule,
    SmallTalkRoutingModule
  ]
})
export class SmallTalkModule { }
