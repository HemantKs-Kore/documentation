import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'valueFormat',
})
export class valueFormatPipe implements PipeTransform {
  transform(input: any, args?: any): any {
    const suffixes = [' K', 'M', 'G', 'T', 'P', 'E'];
    if (Number.isNaN(input)) {
      return null;
    }
    if (input < 1000) {
      return input;
    }
    const exp = Math.floor(Math.log(input) / Math.log(1000));
    return (input / Math.pow(1000, exp)) + suffixes[exp - 1];
  }
}
