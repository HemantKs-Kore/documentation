import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ResultsRulesService } from '../../../services/componentsServices/results-rules.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-rules-table',
  templateUrl: './rules-table.component.html',
  styleUrls: ['./rules-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RulesTableComponent implements OnInit {

  @Input() rulesData;

  constructor(public rulesService: ResultsRulesService) { }

  ngOnInit(): void {
  }

  updateFooter () {
    this.rulesService.showReviewFooter = _.where(this.rulesData, {isChecked: true}).length;
  }
  openAddRulesModal () {
    this.rulesService.openAddRulesModal.next();
  }

}
