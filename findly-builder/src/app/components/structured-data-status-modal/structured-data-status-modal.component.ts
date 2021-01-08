import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { Router } from '@angular/router';
import { from, interval, Subject, Subscription } from 'rxjs';
import { startWith, elementAt, filter } from 'rxjs/operators';
import * as _ from 'underscore';

@Component({
  selector: 'app-structured-data-status-modal',
  templateUrl: './structured-data-status-modal.component.html',
  styleUrls: ['./structured-data-status-modal.component.scss']
})
export class StructuredDataStatusModalComponent implements OnInit {

  @Output() closeStructuredDataStatusModal = new EventEmitter();
  @Input('structuredDataDocPayload') structuredDataDocPayload : any;

  constructor(private notificationService: NotificationService,
    private service: ServiceInvokerService,
    private authService: AuthService,
    public workflowService: WorkflowService,
    private router: Router) { }

  docStatusObject : any = {};
  public pollingSubscriber : any;

  ngOnInit(): void {
  }

  ngOnChanges(changes){
    if(changes && changes.structuredDataDocPayload && changes.structuredDataDocPayload.currentValue){
      this.poling(changes.structuredDataDocPayload.currentValue);
    }
  }

  poling(payload) {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    const queryParms ={
      searchIndexId:this.workflowService.selectedSearchIndexId
    }
    this.pollingSubscriber = interval(10000).pipe(startWith(0)).subscribe(() => {
      this.service.invoke('get.dockStatus', queryParms).subscribe(res => {
        const queuedDoc = _.find(res.dockStatuses, (source) => {
          return (source._id === payload._id);
        });
        if (queuedDoc && (queuedDoc.status)) {
          console.log(queuedDoc);
          this.docStatusObject = JSON.parse(JSON.stringify(queuedDoc));
          if(queuedDoc.status === 'FAILURE' || queuedDoc.status === 'SUCCESS'){
            this.pollingSubscriber.unsubscribe();
          }
        } else {
          this.pollingSubscriber.unsubscribe();
        }
      }, errRes => {
        this.pollingSubscriber.unsubscribe();
        if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to get Status of Docker.', 'error');
        }
      });
    }
    )
  }

  closeModal(){
    this.closeStructuredDataStatusModal.emit();
  }

  ngOnDestroy(){
    if(this.pollingSubscriber){
      this.pollingSubscriber.unsubscribe();
    }
  }

}
