import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnswerSnippetsRoutingModule } from './answer-snippets-routing.module';
import { SimulateComponent } from './simulate/simulate.component';
import { SnippetComponent } from './snippet/snippet.component';
import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { SharedModule } from '../../shared/shared.module';
import { RangeSliderModule } from './../../helpers/components/range-slider/range-slider.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { KrModalModule } from './../../shared/kr-modal/kr-modal.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SliderModule } from '@kore.apps/shared/slider-component/slider.module';

@NgModule({
  declarations: [SimulateComponent, SnippetComponent],
  imports: [
    CommonModule,
    CodemirrorModule,
    FormsModule,
    AnswerSnippetsRoutingModule,
    SharedModule,
    RangeSliderModule,
    DragDropModule,
    TranslateModule.forChild(),
    KrModalModule,
    NgbDropdownModule,
    NgbTooltipModule,
    PerfectScrollbarModule,
    SliderModule
  ],
})
export class AnswerSnippetsModule { }
