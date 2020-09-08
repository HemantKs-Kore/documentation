import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})

export class FaqsService {
    addAltQues = new Subject();
    addFollowQues = new Subject();
    cancel = new Subject();
    updateAltQues = new Subject();
    groupAdded = new Subject();
    inpQuesAdd = new Subject();
    inpKeywordsAdd = new Subject();
    addVariation: {
        alternate: boolean,
        followUp: boolean
    } = {
        alternate: false, 
        followUp: false
    };
    faqData: any = {};

    resetVariation() {
        this.addVariation.alternate = false;
        this.addVariation.followUp = false;
    }

    updateVariation(flag) {
        this.resetVariation();
        this.addVariation[flag] = true;
    }

    updateFaqData(data) {
        this.faqData = data;
    }

    getVariation() {
        return this.addVariation;
    }

}