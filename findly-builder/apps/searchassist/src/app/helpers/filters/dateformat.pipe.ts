import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'dateFormatPipe',
})
export class DateFormatPipe implements PipeTransform {
  transform(date: string, fmt: string): any {
    const dateValue = new Date(date);
    if (dateValue.toString() === 'Invalid Date') {
      return date;
    } else {
      if (fmt) {
        console.log(fmt);
        console.log(format(new Date(dateValue), fmt));
        return format(new Date(dateValue), fmt);
      } else {
        return format(new Date(dateValue), 'MM-dd-yyyy');
      }
    }
  }
}
