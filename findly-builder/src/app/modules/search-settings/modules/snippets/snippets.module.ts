import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SnippetsRoutingModule } from './snippets-routing.module';
import { SnippetsComponent } from './snippets.component';


@NgModule({
  declarations: [SnippetsComponent],
  imports: [
    CommonModule,
    SnippetsRoutingModule
  ]
})
export class SnippetsModule { }
