import {Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'synonymFilter'
})
export class SynonymFilterPipe implements PipeTransform {
    transform(items: any[], search: string) {
        if(!items) return [];
        if(!search) return items;
        if (items && items.length) {
            return items.filter(item => {
                let matched = false
                if(item.keyword && item.keyword.indexOf(search.toLowerCase()) > -1){
                    matched = true;
                }
                if (search && item.values && item.values) {
                    const matchedSyns = item.values.filter(syn => {
                       if(syn.toLowerCase().indexOf(search.toLowerCase()) === -1){
                         return false;
                       }
                       return true;
                    });
                    if(matchedSyns && matchedSyns.length){
                        matched = true;
                    }
                }
                return matched;
           });
        } else {
            return items;
        }
    }
}