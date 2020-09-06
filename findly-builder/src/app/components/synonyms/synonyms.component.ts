import { Component, OnInit } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { AuthService } from '@kore.services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
declare const $: any;

@Component({
  selector: 'app-synonyms',
  templateUrl: './synonyms.component.html',
  styleUrls: ['./synonyms.component.scss']
})
export class SynonymsComponent implements OnInit {
  selectedApp: any = {};
  serachIndexId
  loadingContent : boolean = true;
  haveRecord : boolean = false;
  synonymData : any[];//SynonymModal[] = [];
  synonymDataBack : any[] = [];//SynonymModal[] = [];
  synonymObj: any; //SynonymClass = new SynonymClass();
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  synArr : any[] = [];
  synArrTemp: any[] = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.synArr.push( value.trim());
     // this.synonymObj.synonym = this.synArr.toLocaleString();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  addList(event: MatChipInputEvent,i): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.synonymData[i].synonym.push( value.trim());
    }
    if (input) {
      input.value = '';
    }
  }
  removeList(syn,i): void {
    const index = this.synonymData[i].synonym.indexOf(syn);

    if (index >= 0) {
      this.synonymData[i].synonym.splice(index, 1);
    }
  }
  remove(syn): void {
    const index = this.synArr.indexOf(syn);

    if (index >= 0) {
      this.synArr.splice(index, 1);
    }
  }
  constructor( public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,) { 
    this.synonymObj = new SynonymClass();
  }


  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.loadingContent = false;
    /** hard coded Data */
    let data : Array<SynonymModal> = [{
      name :"Cab",
      synonym :["Taxi"],
    },{
      name :"Bike",
      synonym :["MotorCycle"],
    }];
    this.synonymData = data;
    this.synonymDataBack = data;
    this.synonymData ? this.haveRecord = true : this.haveRecord = false;
    /** hard coded Data */
    const quaryparms: any = {
      searchIndexId:this.serachIndexId
    };
    this.service.invoke('get.synonym', quaryparms).subscribe(res => {
      console.log(res);
      this.synonymData = res;
      this.synonymDataBack = res;
      this.synonymData ? this.haveRecord = true : this.haveRecord = false;
    }, errRes => {
      this.errorToaster(errRes,'Failed to get Synonyms');
    });
  }

  addSynonyms(record){
    const quaryparms: any = {
      searchIndexId:this.serachIndexId
    };
    const payload = {
      synonyms: this.synArr,
      keyword: record.name
    }
    this.service.invoke('create.synonym', quaryparms, payload).subscribe(res => {
      if(record){
        record.synonym =  this.synArr;
        this.synonymData.push(record);
        this.synArr = []
        this.synonymObj = new SynonymClass();
       }
    }, errRes => {
      this.errorToaster(errRes,'Failed to add Synonyms');
      this.synonymObj = new SynonymClass();
    });
    
    if(record){
      record.synonym =  this.synArr;
      this.synonymData.push(record);
      this.synArr = []
      this.synonymObj = new SynonymClass();
     }
  }
  errorToaster(errRes,message){
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message){
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
  }
 }
  applyFilter(value){
    /** Work in Progress */
    if(value){
      this.synonymData= [...this.synonymDataBack];
    let data = [];
    for(let i=0; i< this.synonymData.length ; i++){
      let dataoBJ = {};
      let dataLen = data.length;
      if(this.synonymData[i].name.toLocaleLowerCase().includes(value.toLocaleLowerCase())){
        data.push(this.synonymData[i]);
        dataLen = data.length+1;
      }
      if(data.length == dataLen){
        for(let j=0; j< this.synonymData[i].synonym.length ; j++){
          if(this.synonymData[i].synonym[j].toLocaleLowerCase().includes(value.toLocaleLowerCase())){
            data.push(this.synonymData[i]);
          }
        }
      }
    }
    // this.synonymData.filter(d=>{
    //   let dataoBJ = {};
    //   if(d.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()) || d.synonym.forEach(element => {
    //      element.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    //   })){
    //     return data.push(d);
    //   }

    //   //return data.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    // })
    //data.push(dataoBJ)
    data = [...new Set(data)]
    if(data.length){
      this.synonymData = [...data]; 
      this.haveRecord = true;
    }else{
      this.synonymData = null;
      this.haveRecord = false;
    }
    }else{
      this.synonymData= [...this.synonymDataBack];
      this.haveRecord = true;
    }
    
    
  }
  editSynRecord(record,event,i){
    if(event){
      event.stopImmediatePropagation();
      event.preventDefault();
    }
      $('#collapse_'+i).toggleClass("collapse");
      
  }
  addSynonymsAddedName(synonym, i){
    //this.synonymData[i].synonym = record;
    const quaryparms: any = {
      searchIndexId:this.serachIndexId,
      synonymId: null
    };
    const payload = {
      synonyms: synonym,
      keyword: this.synonymData[i].name
    }
    this.service.invoke('update.synonym', quaryparms ,payload).subscribe(res => {
      console.log(res);
      
    }, errRes => {
      this.errorToaster(errRes,'Failed to update Synonyms');
    });
  }
  deleteSynRecord(record){
    const quaryparms: any = {
      searchIndexId:this.serachIndexId,
      synonymId: null
    };
    this.service.invoke('update.synonym', quaryparms).subscribe(res => {
      console.log(res);
      
    }, errRes => {
      this.errorToaster(errRes,'Failed to delete Synonyms');
    });
  }
  clear(){

  }

}

interface SynonymModal {
  name: String ,
  synonym: Array<String>
}
class SynonymClass {
  name: String
  synonym: Array<String>
}

