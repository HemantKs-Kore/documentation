import { TextTransformPipe } from './textTransfom.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { valueFormatPipe } from './number-format.pipe';
import { MultiFilterPipe } from './multiFilter.pipe';
import { FilterPipe } from './filter.pipe';
import { DateFormatPipe } from './dateformat.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    DateFormatPipe,
    FilterPipe,
    MultiFilterPipe,
    valueFormatPipe,
    SafeHtmlPipe,
    TextTransformPipe,
  ],
  imports: [CommonModule],
  exports: [
    DateFormatPipe,
    FilterPipe,
    MultiFilterPipe,
    valueFormatPipe,
    SafeHtmlPipe,
    TextTransformPipe,
  ],
})
export class SharedPipesModule {}
