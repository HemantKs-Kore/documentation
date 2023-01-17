import {Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'traitsFilter'
})
export class TraitsFilterPipe implements PipeTransform {
    transform(items: any[], search: string) {
        if(!items) return [];
        if(!search) return items;
        if (items && items.length) {
            return items.filter(item => {
                let matched = false
                if(item.groupName && item.groupName.indexOf(search.toLowerCase()) > -1){
                    matched = true;
                }
                if (search && item.traits && item.traits) {
                    const matchedTraits = item.traits.filter(trait => {
                       if(trait.traitName.toLowerCase().indexOf(search.toLowerCase()) === -1){
                         return false;
                       }
                       return true;
                    });
                    if(matchedTraits && matchedTraits.length){
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