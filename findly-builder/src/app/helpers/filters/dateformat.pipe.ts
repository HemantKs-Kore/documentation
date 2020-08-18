import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
   name: 'dateFormatPipe'
})
export class dateFormatPipe  implements PipeTransform {
   transform(date: string): any {
    var _mmts = new Date(date);
    if(_mmts.toString() === "Invalid Date"){
        return "-";
    }
    else{
        return moment(_mmts).format('DD MMM YYYY');
    }
   }
}