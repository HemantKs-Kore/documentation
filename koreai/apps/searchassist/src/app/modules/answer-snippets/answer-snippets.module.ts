import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnswerSnippetsRoutingModule } from './answer-snippets-routing.module';
import { SimulateComponent } from './simulate/simulate.component';
import { SnippetComponent } from './snippet/snippet.component';

@NgModule({
  declarations: [SimulateComponent, SnippetComponent],
  imports: [CommonModule, AnswerSnippetsRoutingModule],
})
export class AnswerSnippetsModule {}
