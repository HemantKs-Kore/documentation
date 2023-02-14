import { Pipe, PipeTransform } from '@angular/core';

/* Truncate pipe to wrap text, ellipse text with limit */
/* Syntax: .html file => {{longStr | truncate : 12 : false : '***' }}  */
/* 
    Created on : 16 July, 2020
    Author     : Pradeep muniganti
*/

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 25, completeWords = false, ellipsis = '...') {
    if(!value) {
      return ;
    }
    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    return value.length > limit ? value.substr(0, limit) + ellipsis : value;
  }
}