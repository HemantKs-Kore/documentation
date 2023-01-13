import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
   name: 'dateFormatPipe'
})
export class DateFormatPipe  implements PipeTransform {
   transform(date: string , format: string): any {
    const dateValue = new Date(date);
    if (dateValue.toString() === 'Invalid Date') {
        return date;
    } else {
        if (format) {
            return moment(dateValue).format(format);
        } else {
            return moment(dateValue).format('MM-DD-YYYY');
        }
    }
   }
}
