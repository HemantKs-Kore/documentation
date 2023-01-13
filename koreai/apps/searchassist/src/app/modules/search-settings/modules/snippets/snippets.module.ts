import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SnippetsRoutingModule } from './snippets-routing.module';
import { SnippetsComponent } from './snippets.component';
import { FindlySharedModule } from '../../modules/findly-shared/findly-shared.module';


@NgModule({
  declarations: [SnippetsComponent],
  imports: [
    CommonModule,
    SnippetsRoutingModule,
    FindlySharedModule
  ]
})
export class SnippetsModule { }
