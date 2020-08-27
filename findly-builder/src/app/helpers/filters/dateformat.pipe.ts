import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
   name: 'dateFormatPipe'
})
export class DateFormatPipe  implements PipeTransform {
   transform(date: string): any {
    const _date = new Date(date);
    if(_date.toString() === 'Invalid Date'){
        return '-';
    }
    else{
        return moment(_date).format('DD MMM YYYY');
    }
   }
}