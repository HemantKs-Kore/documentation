import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'textTransform'
})
export class TextTransformPipe implements PipeTransform {
    transform(value: string): string {
      const splitBy = '/';
      const splittedText = value.split(splitBy);
      return `${splittedText[1]}`;
    }
  }
