import { Component, OnInit } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
declare const $: any;

@Component({
  selector: 'app-synonyms',
  templateUrl: './synonyms.component.html',
  styleUrls: ['./synonyms.component.scss']
})
export class SynonymsComponent implements OnInit {
  loadingContent : boolean = true;
  haveRecord : boolean = false;
  synonymData : SynonymModal[] = [];
  synonymDataBack : SynonymModal[] = [];
  synonymObj: any; //SynonymClass = new SynonymClass();
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  synArr : any[] = [];

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
  removeList(syn): void {
    const index = this.synArr.indexOf(syn);

    if (index >= 0) {
      this.synArr.splice(index, 1);
    }
  }
  remove(syn): void {
    const index = this.synArr.indexOf(syn);

    if (index >= 0) {
      this.synArr.splice(index, 1);
    }
  }
  constructor() { 
    this.synonymObj = new SynonymClass();
  }


  ngOnInit(): void {
    this.loadingContent = false;
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
  }

  addSynonyms(record){
   if(record){
    record.synonym =  this.synArr;
    this.synonymData.push(record);
    this.synArr = []
    this.synonymObj = new SynonymClass();
   }
    
  }

  applyFilter(value){
    this.synonymData= [...this.synonymDataBack];
    let data = [...this.synonymData] 
     data = data.filter(data=>{
      data.synonym.forEach(element => {
        return element.toLocaleLowerCase().includes(value.toLocaleLowerCase())
      });
      return data.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    })
    if(data){
      this.synonymData = [...data];
      this.haveRecord = true;
    }else{
      this.haveRecord = false;
    }
    
  }
  editSynRecord(record,event,i){
    if(event){
      event.stopImmediatePropagation();
      event.preventDefault();
    }
   // $("button").click(function(){
      $('#collapse_'+i).toggleClass("collapse");
    //});
    // var a = document.getElementById('coll_'+i) as HTMLAnchorElement; //or grab it by tagname etc
    // a.href = '#collapse_'+i
    // a.click();

    document.getElementById('collapse_'+i)[0].style.display = "block";
  }
  deleteSynRecord(record){

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

