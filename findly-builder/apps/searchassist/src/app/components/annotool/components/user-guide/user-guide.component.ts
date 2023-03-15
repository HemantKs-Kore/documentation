/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import {
  selectAppIds,
  selectSearchIndexId,
} from '@kore.apps/store/app.selectors';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'kr-user-guide',
  standalone: true,
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss'],
  imports: [TranslateModule],
})
export class UserGuideComponent implements OnInit, OnDestroy {
  selectedApp;
  searchIndexId;
  jobId;
  sub: Subscription;

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UserGuideComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private store: Store
  ) {}

  ngOnInit() {
    this.jobId = this.workflowService.selectedJob_id;
  }

  initAppIds() {
    const idsSub = this.store
      .select(selectSearchIndexId)
      .subscribe((searchIndexId) => {
        this.searchIndexId = searchIndexId;
      });
    this.sub?.add(idsSub);
  }

  // close modal
  close(cancelFaqExtract?) {
    const payload = {
      status: 'failed',
    };
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      jobId: this.jobId,
    };
    this.service.invoke('put.cancelAnnotation', quaryparms, payload).subscribe(
      (res) => {
        // console.log(res)
      },
      (errRes) => {
        // console.log(errRes)
      }
    );

    this.dialogData.pdfResponse.backToSource = true;
    this.dialogRef.close(cancelFaqExtract || '');
  }
  // get started
  getStarted() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
