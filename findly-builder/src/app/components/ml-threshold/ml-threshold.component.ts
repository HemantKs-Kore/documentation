import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ml-threshold',
  templateUrl: './ml-threshold.component.html',
  styleUrls: ['./ml-threshold.component.scss']
})
export class MlThresholdComponent implements OnInit {
  fundamentalFlag: boolean = false;
  knowledgeGraphFlag: boolean = false;
  MLflag: boolean = false;
  rankingResolverFlag: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  // Accordians
  switchFundamentalMean() {
    this.fundamentalFlag = !this.fundamentalFlag;
  }
  switchKnowledgeGraph() {
    this.knowledgeGraphFlag = !this.knowledgeGraphFlag;
  }
  switchMachineLearn() {
    this.MLflag = !this.MLflag;
  }
  switchrankingResolver() {
    this.rankingResolverFlag = !this.rankingResolverFlag;
  }
}
