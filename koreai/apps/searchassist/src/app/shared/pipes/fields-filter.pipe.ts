import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'fieldsFilter',
  standalone: true,
})
export class FieldsFilterPipe implements PipeTransform {
  transform(items: any[], searchArray: any[]): any[] {
    if (!items) return [];
    if (!searchArray[0]) return items;
    return items.filter((it) => {
      if (searchArray && searchArray.length && searchArray[1]) {
        if (it.fieldDataType === 'number') {
          return it[searchArray[1]].toString().includes(searchArray[0]);
        } else {
          return it[searchArray[1]].toString().includes(searchArray[0]);
        }
      } else {
        if (it.fieldDataType === 'number') {
          return it.includes(searchArray[0]);
        } else {
          return it.toLowerCase().includes(searchArray[0]);
        }
      }
    });
  }
}
