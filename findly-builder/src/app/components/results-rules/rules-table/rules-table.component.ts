import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ResultsRulesService } from '../../../services/componentsServices/results-rules.service';
import * as _ from 'underscore';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-rules-table',
  templateUrl: './rules-table.component.html',
  styleUrls: ['./rules-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RulesTableComponent implements OnInit {

  @Input() rulesData;
  tabActive: string;
  constructor(public rulesService: ResultsRulesService) { }

  ngOnInit(): void {
    this.tabActive = this.rulesData[0].state;
    setInterval(()=>{console.log(this.rulesService.showReviewFooter);}, 2000);
  }

  updateFooter () {
    this.rulesService.showReviewFooter = _.where(this.rulesData, {isChecked: true}).length;
  }
  openAddRulesModal (ruleData) {
    this.rulesService.openAddRulesModal.next(ruleData);
  }

}
