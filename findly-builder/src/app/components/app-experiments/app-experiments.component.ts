import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';

@Component({
  selector: 'app-app-experiments',
  templateUrl: './app-experiments.component.html',
  styleUrls: ['./app-experiments.component.scss']
})
export class AppExperimentsComponent implements OnInit {
  addExperimentsRef:any;
  @ViewChild('addExperiments') addExperiments: KRModalComponent;
  constructor() { }

  ngOnInit(): void {
  }
  closeModalPopup(){
    this.addExperimentsRef.close();
  }
  addExperiment(){
    this.addExperimentsRef = this.addExperiments.open();
  }
}
