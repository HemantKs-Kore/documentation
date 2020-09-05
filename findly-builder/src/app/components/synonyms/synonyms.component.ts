import { Component, OnInit } from '@angular/core';

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
  synonymObj: SynonymModal;
  constructor() { 
    this.synonymObj = new SynonymClass();
  }


  ngOnInit(): void {
    this.loadingContent = false;
    let data : Array<SynonymModal> = [{
      name :"Cab",
      synonym :"Taxi",
    },{
      name :"Bike",
      synonym :"MotorCycle",
    }];
    this.synonymData = data;
    this.synonymDataBack = data;
    this.synonymData ? this.haveRecord = true : this.haveRecord = false;
  }

  addSynonyms(record : SynonymModal){
   this.synonymData.push(record);
   this.synonymObj = new SynonymClass();
  }

  applyFilter(value){
    this.synonymData= [...this.synonymDataBack];
    let data = [...this.synonymData] 
     data = data.filter(data=>{
      return data.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()) || data.synonym.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    })
    if(data){
      this.synonymData = [...data];
      this.haveRecord = true;
    }else{
      this.haveRecord = false;
    }
    
  }
  clear(){

  }

}

interface SynonymModal {
  name: String ,
  synonym: String
}
class SynonymClass {
  name: String
  synonym: String
}

