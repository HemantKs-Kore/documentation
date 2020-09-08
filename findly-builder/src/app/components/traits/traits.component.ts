import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';

@Component({
  selector: 'app-traits',
  templateUrl: './traits.component.html',
  styleUrls: ['./traits.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TraitsComponent implements OnInit {
  @ViewChild('statusModalPop') statusModalPop: KRModalComponent;
  statusModalPopRef: any = [];
  traitsObj: any = [];
  traitType: string;
  traitsTableData: any = [];
  loaderFlag: boolean = false;
  emptyData: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }
  openStatusModal() {
    this.statusModalPopRef  = this.statusModalPop.open();
   }
  closeStatusModal() {
    if (this.statusModalPopRef &&  this.statusModalPopRef.close) {
      this.statusModalPopRef.close();
    }
   }
   addTraits(traitValue) {
     if(traitValue.value) {
      // console.log(traitValue.value);
      let obj = {
        traits: traitValue.value,
        utterances: []
      }
      this.traitsObj.push(obj);
      traitValue.value = '';
     }
   }
   addUtterances(utteranceValue, parentIndex) {
     if(utteranceValue.value) {
      // console.log(utteranceValue.value);
      this.traitsObj[parentIndex].utterances.push(utteranceValue.value);
      utteranceValue.value = '';
     }
  }
   removeTraits(index) {
    this.traitsObj.splice(index, 1);
   }
   removeUtterances(index, parentIndex) {
    this.traitsObj[parentIndex].utterances.splice(index, 1);
   }
   saveTraitsData() {
    //  this.traitsTableData
    if(this.traitsObj && this.traitsObj.length) {
      let mockData = {
        traitType: this.traitType,
        traits: this.traitsObj
      };
      this.traitsTableData.push(mockData);
      // console.log(this.traitsObj);
      this.traitsObj = [];
      this.traitType = '';
      this.emptyData = false;     
      this.closeStatusModal();
    }
   }
}
