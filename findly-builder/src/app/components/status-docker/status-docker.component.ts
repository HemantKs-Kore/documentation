import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { ServiceInvokerService } from '../../services/service-invoker.service';
import { WorkflowService } from '../../services/workflow.service';
import { from, interval, Subject, Subscription } from 'rxjs';
import { startWith, elementAt, filter } from 'rxjs/operators';
import * as _ from 'underscore';

@Component({
  selector: 'app-status-docker',
  templateUrl: './status-docker.component.html',
  styleUrls: ['./status-docker.component.scss']
})
export class StatusDockerComponent implements OnInit {

  @Input('statusDockerLoading') statusDockerLoading : any;

  public dockersList : Array<any> = [];
  public pollingSubscriber : any;

  constructor(private service:ServiceInvokerService,
    private workflowService: WorkflowService,
    private notify: NotificationService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes){
    if(changes.statusDockerLoading.currentValue){
      this.statusDockerLoading = changes.statusDockerLoading.currentValue;
      this.poling();
    }
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
        return 'Queued';
      }
      else if(status === 'IN_PROGRESS'){
        return 'In Progress';
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

  naviateToContent(task){
    console.log("task naviateToContent", task);
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
        this.dockersList = [];
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
  }

}
