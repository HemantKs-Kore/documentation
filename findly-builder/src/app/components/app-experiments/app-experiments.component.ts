import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';

@Component({
  selector: 'app-app-experiments',
  templateUrl: './app-experiments.component.html',
  styleUrls: ['./app-experiments.component.scss']
})
export class AppExperimentsComponent implements OnInit {
  addExperimentsRef:any;
  experiment:any={
    variantData:[]
  }
  @ViewChild('addExperiments') addExperiments: KRModalComponent;
  varients=[{color:'#ff0000',code:'A'},{color:'#0000ff',code:'B'},{color:'#8cff1a',code:'C'},{color:'#ffff00',code:'D'},{color:'#c44dff',code:'E'}];
  constructor() { }

  ngOnInit(): void {
  }
  closeModalPopup(){
    this.varientArray = [];
    this.experiment={variantData:[]};
    this.addExperimentsRef.close();
  }
  addExperiment(){
    this.addExperimentsRef = this.addExperiments.open();
  }
  //add new varient method
  varientArray:any=[];
  addVarient(){
    if(this.varientArray.length<=4)
      this.varientArray.push(this.varients[this.varientArray.length]);
  }
  //close varient method
  closeVariant(data){
    const index = this.varientArray.indexOf(data); 
    if (index > -1) this.varientArray.splice(index, 1);

  }
  //add new experiment method
  createExperiment(){
    console.log("experiment",this.experiment)
  }
}
