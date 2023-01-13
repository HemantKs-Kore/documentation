import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';


@Component({
  selector: 'kr-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {
  selectedApp;
  searchIndexId;
  jobId;


  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UserGuideComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) { }

  ngOnInit() {
    this.selectedApp = this.workflowService.selectedApp();
    this.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    this.jobId = this.workflowService.selectedJob_id
  }
  // close modal
  close(cancelFaqExtract?) {
    const payload= {
      status : "failed"
    }
    const quaryparms: any = {
      searchIndexId: this.searchIndexId, 
      jobId : this.jobId
    }
    this.service.invoke('put.cancelAnnotation',quaryparms, payload).subscribe(res => {
      // console.log(res)

    }, errRes => {
      // console.log(errRes)
    });

    this.dialogData.pdfResponse.backToSource = true;
    this.dialogRef.close(cancelFaqExtract||'');
  }
  // get started
  getStarted() {
    this.dialogRef.close();
  }
}
