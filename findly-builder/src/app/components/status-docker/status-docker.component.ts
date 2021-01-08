import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { ServiceInvokerService } from '../../services/service-invoker.service';
import { WorkflowService } from '../../services/workflow.service';
import { from, interval, Subject, Subscription } from 'rxjs';
import { startWith, elementAt, filter } from 'rxjs/operators';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import * as moment from 'moment';
import {  DockStatusService} from '../../services/dock.status.service';
declare let self: any;
@Component({
  selector: 'app-status-docker',
  templateUrl: './status-docker.component.html',
  styleUrls: ['./status-docker.component.scss']
})
export class StatusDockerComponent implements OnInit {
   fileId;

  @Input('statusDockerLoading') statusDockerLoading : any;

  public dockersList : Array<any> = [];
  public pollingSubscriber : any;
  public dockServiceSubscriber: any;
   
  constructor(private service:ServiceInvokerService,
    private workflowService: WorkflowService,
    private notify: NotificationService,
    private dock : DockStatusService,
    private router: Router) { }

  ngOnInit(): void {
    self = this;
   this.dockServiceSubscriber = this.dock.change.subscribe(data=>{
      this.poling();
    })
  }

  ngOnChanges(changes){
    if(changes.statusDockerLoading.currentValue){
      this.statusDockerLoading = changes.statusDockerLoading.currentValue;
      this.poling();
    }
  }
  initDockStatus(){
    self.poling();
  }
  poling() {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    const queryParms ={
      searchIndexId:this.workflowService.selectedSearchIndexId
    }
    this.pollingSubscriber = interval(10000).pipe(startWith(0)).subscribe(() => {
      this.service.invoke('get.dockStatus', queryParms).subscribe(res => {
        this.statusDockerLoading = false;
        this.dockersList = JSON.parse(JSON.stringify(res.dockStatuses));
        this.dockersList.forEach((record : any) => {
          record.createdOn = moment(record.createdOn).format("Do MMM YYYY | h:mm A");
          if(record.status === 'SUCCESS' && record.fileId && !record.store.toastSeen){
            this.downloadDockFile(record.fileId, record.store.urlParams,record.streamId,record._id);

          }
        })
        const queuedJobs = _.filter(res.dockStatuses, (source) => {
          return ((source.status === 'IN_PROGRESS') || (source.status === 'QUEUED'));
        });
       
        if (queuedJobs && queuedJobs.length) {
          console.log(queuedJobs);
        } else {
          this.pollingSubscriber.unsubscribe();
        }
      }, errRes => {
        this.pollingSubscriber.unsubscribe();
        if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
          this.notify.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notify.notify('Failed to get Status of Docker.', 'error');
        }
      });
    }
    )
  }

  getStatusView(status, other?){
    if(other){
      if(status === 'HALTED'){
        return 'Stopped';
      }
      else if(status === 'QUEUED'){
        return 'In-queue';
      }
      else if(status === 'IN_PROGRESS'){
        return 'In-progress';
      }
    }
    else{
      if(status === 'SUCCESS' || status === 'FAILURE'){
        return true;
      }
      else{
        return false;
      }
    }
  }

  navigateTo(task){
    if (task.jobType === 'faq') {
      this.router.navigate(['/faqs'], { skipLocationChange: true })
    } else {
      this.router.navigate(['/content'], { skipLocationChange: true });
    }
  }

  removeRecord(task, index){
    if(task._id){
      this.statusDockerLoading = true;
      const queryParms ={
        searchIndexId:this.workflowService.selectedSearchIndexId,
        id : task._id,
        statusType : task.statusType
      }
      this.service.invoke('delete.dockById', queryParms).subscribe(
        res => {
          this.statusDockerLoading = false;
          this.dockersList.splice(index, 1);
          this.notify.notify(res.msg, 'success');
        },
        errRes => {
          this.statusDockerLoading = false;
          this.errorToaster(errRes,'Failed to get Status of Docker.');
        }
      );
    }    
    else{
      this.notify.notify('Failed to remove this Job.', 'error');
    }
  }

  clearAllRecords(){
    this.statusDockerLoading = true;
    const queryParms ={
      searchIndexId:this.workflowService.selectedSearchIndexId,
    }
    this.service.invoke('delete.clearAllDocs', queryParms).subscribe(
      res => {
        this.statusDockerLoading = false;
        // this.dockersList = [];
        this.poling();
        this.notify.notify(res.msg, 'success');
      },
      errRes => {
        this.statusDockerLoading = false;
        this.errorToaster(errRes,'Failed to get Status of Docker.');
      }
    );
  }

  recrawl(record){
     const quaryparms : any = {
      searchIndexId: this.workflowService.selectedSearchIndexId,
      sourceId: record.extractionSourceId,
      sourceType: record.statusType,
    };
    this.service.invoke('recrwal', quaryparms).subscribe(res => {
      this.poling();
      this.notify.notify('Recrwaled with status : '+ res.recentStatus, 'success');
     }, errRes => {
       if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
         this.notify.notify(errRes.error.errors[0].msg, 'error');
       } else {
         this.notify.notify('Failed ', 'error');
       }
     });
   }

  errorToaster(errRes,message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
      this.notify.notify(errRes.error.errors[0].msg, 'error');
    } else if (message){
      this.notify.notify(message, 'error');
    } else {
      this.notify.notify('Somthing went worng', 'error');
    }
  }

  ngOnDestroy() {
    if(this.pollingSubscriber){
      this.pollingSubscriber.unsubscribe(); 
    }
    if(this.dockServiceSubscriber){
      this.dockServiceSubscriber.unsubscribe();
    }
  }
  downloadDockFile(fileId, fileName,streamId,dockId) {
        const params = {
      fileId,
    streamId : streamId,
    dockId  :  dockId
    }
   let payload = {
    "store":{
      "toastSeen":true,
      "urlParams":fileName,
             }      
    }
    this.service.invoke('attachment.file', params ).subscribe(res=>{
       let hrefURL = res.fileUrl + fileName;
       window.open(hrefURL , '_self');
        this.service.invoke('put.dockStatus',params,payload).subscribe(res=>{
        }
        )
    }, err=>{ console.log(err) });
}
}
