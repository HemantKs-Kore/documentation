import { Component, OnInit } from '@angular/core';
import { RangeSlider } from '../../helpers/models/range-slider.model';
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
  mlDefData: any;
  nGramData: any;
  mlThreshData: any;
  pathCoverData: any;
  kgSuggestionsData: any;
  proxSuggData: any;
  proxProbData: any;
  minDefKgData: any;
  constructor() { }

  ngOnInit(): void {
    //RangeSlider - (minVal, maxVal, step, default, id)
    this.mlDefData = new RangeSlider(80, 100, 1, 90, 'mlDefScoreRange');
    this.nGramData = new RangeSlider(1, 4, 1, 2,'nGramSeqRange');
    this.mlThreshData = new RangeSlider(0, 1, 0.05, 0.5, 'mlThresholdRange');
    this.pathCoverData = new RangeSlider(0, 100, 1, 50, 'pathCoverRange');
    this.kgSuggestionsData = new RangeSlider(0, 5, 1, 2, 'kgSuggRange');
    this.proxSuggData = new RangeSlider(0, 50, 1, 20, 'proxSuggRange');
    this.proxProbData = new RangeSlider(0, 20, 1, 5, 'proxProbRange');
    this.minDefKgData = new RangeSlider(0, 100, 1, 20, 'minDefKgRange');
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
