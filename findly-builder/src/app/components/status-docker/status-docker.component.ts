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
        /**made changes on 24/02 as per new api contract in response we no longer use the key
         dockStatuses added updated code in 61 line*/
        // this.dockersList = JSON.parse(JSON.stringify(res.dockStatuses));
        this.dockersList = JSON.parse(JSON.stringify(res));
        this.dockersList.forEach((record : any) => {
          record.createdOn = moment(record.createdOn).format("Do MMM YYYY | h:mm A");
          /**made code updates in line no 66 on 03/01 added new condition for success,since SUCCESS is upadted to success as per new api contract */
          // if(record.status === 'SUCCESS' && record.fileId && !record.store.toastSeen){
            if((record.status === 'SUCCESS' || record.status === 'success') && record.fileId && !record.store.toastSeen){
            if(record.action === 'EXPORT'){
              this.downloadDockFile(record.fileId, record.store.urlParams,record.streamId,record._id);
            }
          }
        })
        /**made changes on 24/02 as per new api contract in response we no longer use the key
         dockStatuses added updated code in 73 line*/
        // const queuedJobs = _.filter(res.dockStatuses, (source) => {
          const queuedJobs = _.filter(res, (source) => {
          /**made code updates on 24/02 in line 76 added new condition for running state as per new contract In_progress updated to running */
          // return ((source.status === 'IN_PROGRESS') || (source.status === 'QUEUED') || (source.status === 'validation'));
          return ((source.status === 'IN_PROGRESS') || (source.status === 'running') || (source.status === 'QUEUED') || (source.status === 'validation'));
        });
       
        if (queuedJobs && queuedJobs.length) {
          // console.log(queuedJobs);
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
      /**made code updates in line no 102 on 03/01 added new condition for halted,since HALTED is updated to halted as per new api contract */
      // if(status === 'HALTED'){
        if(status === 'HALTED' || status === 'halted'){
        return 'Stopped';
      }
      else if(status === 'QUEUED'){
        return 'In-queue';
      }
      /**made code updates on 24/02 in line 106 added new condition for running state as per new contract In_progress updated to running */
      // else if(status === 'IN_PROGRESS' || status === 'validation' ){
      else if((status === 'IN_PROGRESS' || status === 'running')  || status === 'validation' ){
        return 'In-progress';
      }
    }
    else{
      /**made code updates on 24/02 in line 113 added new condition for Failed state as per new contract Failure updated to Failed */
      // if(status === 'SUCCESS' || status === 'FAILURE'){
      //made code updates in line no 116 on 03/01 added new condition for success,since SUCCESS is upadted to success as per new api contract
      if((status === 'SUCCESS'||status === 'success') || (status === 'FAILURE' || status === 'FAILED')){
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
      // this.statusDockerLoading = true;
      const queryParms ={
        searchIndexId:this.workflowService.selectedSearchIndexId,
        id : task._id,
        statusType : task.statusType
      }
      this.service.invoke('delete.dockById', queryParms).subscribe(
        res => {
          this.statusDockerLoading = true;
          this.dockersList.splice(index, 1);
          // this.notify.notify(res.msg, 'success');
          this.statusDockerLoading = false;
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
    const queryParms ={
      searchIndexId:this.workflowService.selectedSearchIndexId,
    }
    this.service.invoke('delete.clearAllDocs', queryParms).subscribe(
      res => {
        this.statusDockerLoading = true;
        // this.dockersList = [];
        this.poling();
        // this.notify.notify(res.msg, 'success');
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
