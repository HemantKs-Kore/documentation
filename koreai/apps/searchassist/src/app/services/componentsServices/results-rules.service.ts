import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})

export class ResultsRulesService {
    selectAll = new Subject();
    openAddRulesModal = new Subject();
    deleteRule = new Subject();
    bulkSend = new Subject();
    bulkDelete = new Subject();
    showReviewFooter: boolean = false;
    isCheckAll: boolean = false;
    
}