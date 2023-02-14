import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'valueFormat',
})
export class valueFormatPipe implements PipeTransform {
  transform(input: any, args?: any): any {
    const suffixes = [' k', 'M', 'G', 'T', 'P', 'E'];
    if (Number.isNaN(input)) {
      return null;
    }
    if (input < 1000) {
      return input;
    }
    const exp = Math.floor(Math.log(input) / Math.log(1000));
    return (input / Math.pow(1000, exp)).toFixed(2) + suffixes[exp - 1];
  }
}
