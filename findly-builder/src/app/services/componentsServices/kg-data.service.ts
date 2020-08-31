import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})

export class KgDataService {
    kgTaskId: string;
    importFileComplete = new Subject();
    importFaqs = new Subject();

    setKgTaskId(id) {
        this.kgTaskId = id;
    }

    getKgTaskId() {
        return this.kgTaskId;
    }

    importComplete() {
        this.importFileComplete.next();
    }

}