import {Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'MultiFilter'
})
export class MultiFilterPipe implements PipeTransform {
    transform(items: any[], search: string, starred: boolean) {
        if (items && items.length) {
            return items.filter(item => {
                if (search && item.text.toLowerCase().indexOf(search.toLowerCase()) === -1) {
                    return false;
                }
                if (starred) {
                    return item.starred;
                }
                return true;
           });
        } else {
            return items;
        }
    }
}