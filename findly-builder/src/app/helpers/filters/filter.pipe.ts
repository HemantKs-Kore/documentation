import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchArray: any[]): any[] {
    if(!items) return [];
    if(!searchArray[0]) return items;
    searchArray[0] = searchArray[0].toLowerCase();
    return items.filter( it => {
      if(searchArray && searchArray.length && searchArray[1]){
        return it[searchArray[1]].toLowerCase().includes(searchArray[0]);
      } else {
        return it.toLowerCase().includes(searchArray[0]);
      }
    });
   }
}