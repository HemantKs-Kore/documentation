import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { Subscription, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectSearchIndexId } from '@kore.apps/store/app.selectors';

@Component({
  selector: 'app-analytics-dropdown',
  standalone: true,
  templateUrl: './analytics-dropdown.component.html',
  styleUrls: ['./analytics-dropdown.component.scss'],
  imports: [NgbDropdownModule, PerfectScrollbarModule],
})
export class AnalyticsDropdownComponent implements OnInit, OnDestroy {
  sub: Subscription;
  // selectedApp;
  searchIndexId;
  indexConfigs: any = [];
  selectedIndexConfig: any;
  selecteddropname: any;
  indexConfigObj: any = {};
  @Output() dropdownpipelineid = new EventEmitter();
  @Input() indexarray;

  constructor(public workflowService: WorkflowService, private store: Store) {}

  ngOnInit(): void {
    this.initAppIds();
    this.indexConfigs = this.indexarray;
    this.indexConfigs.forEach((element, index) => {
      this.indexConfigObj[element._id] = element;
      if (element.default === true) {
        this.selecteddropname = element.name;
      }
    });
  }

  initAppIds() {
    const idsSub = this.store
      .select(selectSearchIndexId)
      .pipe(
        take(1),
        tap((searchIndexId) => {
          this.searchIndexId = searchIndexId;
        })
      )
      .subscribe();

    this.sub?.add(idsSub);
  }

  getDetails(config?) {
    this.selecteddropname = config.name;
    this.selectedIndexConfig = config._id;
    this.dropdownpipelineid.emit(this.selectedIndexConfig);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
