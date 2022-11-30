import { Component, OnInit,Output,Input,EventEmitter } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { of, interval, Subject, Subscription } from 'rxjs';
import { RangeSlider } from '../../helpers/models/range-slider.model';

@Component({
  selector: 'app-search-relevance',
  templateUrl: './search-relevance.component.html',
  styleUrls: ['./search-relevance.component.scss']
})
export class SearchRelevanceComponent implements OnInit {
  @Input() searchrelevancedata: any;
  weightModal = {
            fieldName: 'matchThreshold',
            fieldDataType: 'number',
            fieldId: 'matchThreshold',
            sliderObj: new RangeSlider(0, 100, 1,30,'matchThreshold','',true)
  };
 
  constructor() { }
  sliderOpen;
  disableCancle: any = true;
  ngOnInit(): void {
    console.log(this.searchrelevancedata.matchThreshold)
    this.prepareThreshold()

  }

  prepareThreshold(){ 
  
          // const name = ('matchThreshold' || '').replace(/[^\w]/gi, '')
          // const obj = {
          //   fieldName: name,
          //   fieldDataType: 'number',
          //   fieldId: 'matchThreshold',
          //   sliderObj: new RangeSlider(0, 100, 1,this.searchrelevancedata.matchThreshold,'matchThreshold','',true)
          // }
          //this.weightModal= obj;
  }
 
 
  

  valueEvent(val, outcomeObj) {
    outcomeObj.scale = val;
  }



   addOrUpddate(weight, dialogRef?, type?)
   {}

}
