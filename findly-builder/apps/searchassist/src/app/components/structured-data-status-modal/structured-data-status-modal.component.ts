import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { Router } from '@angular/router';
import { from, interval, Subject, Subscription } from 'rxjs';
import { startWith, elementAt, filter } from 'rxjs/operators';
import * as _ from 'underscore';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { AppSelectionService } from '@kore.services/app.selection.service';

@Component({
  selector: 'app-structured-data-status-modal',
  templateUrl: './structured-data-status-modal.component.html',
  styleUrls: ['./structured-data-status-modal.component.scss'],
})
export class StructuredDataStatusModalComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Output() closeStructuredDataStatusModal = new EventEmitter();
  @Input() structuredDataDocPayload: any;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;

  constructor(
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
    private authService: AuthService,
    public workflowService: WorkflowService,
    private appSelectionService: AppSelectionService,
    private router: Router
  ) {}

  docStatusObject: any = {};
  componentType = 'addData';
  public pollingSubscriber: any;

  ngOnInit(): void {}

  ngOnChanges(changes) {
    setTimeout(() => {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 500);
    if (
      changes &&
      changes.structuredDataDocPayload &&
      changes.structuredDataDocPayload.currentValue
    ) {
      this.poling(changes.structuredDataDocPayload.currentValue);
    }
  }

  poling(payload) {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId,
    };
    this.pollingSubscriber = interval(10000)
      .pipe(startWith(0))
      .subscribe(() => {
        this.service.invoke('get.dockStatus', queryParms).subscribe(
          (res) => {
            /**made changes on 24/02 as per new api contract in response we no longer use the key
         dockStatuses added updated code in 57 line*/
            // const queuedDoc = _.find(res.dockStatuses, (source) => {
            const queuedDoc = _.find(res, (source) => {
              return source._id === payload._id;
            });
            if (queuedDoc && queuedDoc.status) {
              // console.log(queuedDoc);
              this.docStatusObject = JSON.parse(JSON.stringify(queuedDoc));
              //**Added conditions for FAILED and success on 25/02 in line 65 as per new contract since Failure is updated to Failed and SUCCESS is upadted to success*/
              // if(queuedDoc.status === 'FAILURE' || queuedDoc.status === 'SUCCESS'){
              if (
                queuedDoc.status === 'FAILURE' ||
                queuedDoc.status === 'FAILED' ||
                queuedDoc.status === 'SUCCESS' ||
                queuedDoc.status === 'success'
              ) {
                /**made code updates in line no 68 on 03/01 added new condition for success,since SUCCESS is upadted to success as per new api contract */
                // if(queuedDoc.status === 'SUCCESS'){
                if (
                  queuedDoc.status === 'SUCCESS' ||
                  queuedDoc.status === 'success'
                ) {
                  this.notificationService.notify(
                    'Imported Successfully',
                    'success'
                  );
                  this.appSelectionService.updateTourConfig('addData');
                }
                this.pollingSubscriber.unsubscribe();
              }
            } else {
              this.pollingSubscriber.unsubscribe();
            }
          },
          (errRes) => {
            this.pollingSubscriber.unsubscribe();
            if (
              errRes &&
              errRes.error &&
              errRes.error.errors &&
              errRes.error.errors.length &&
              errRes.error.errors[0].msg
            ) {
              this.notificationService.notify(
                errRes.error.errors[0].msg,
                'error'
              );
            } else {
              this.notificationService.notify(
                'Failed to get Status of Docker.',
                'error'
              );
            }
          }
        );
      });
  }

  abortDoc() {
    const queryParms = {
      searchIndexId: this.workflowService.selectedSearchIndexId,
      id: this.docStatusObject._id,
      statusType: this.docStatusObject.statusType,
    };
    this.service.invoke('delete.dockById', queryParms).subscribe(
      (res) => {
        this.closeModal();
        this.notificationService.notify(res.msg, 'success');
      },
      (errRes) => {
        this.notificationService.notify(errRes, 'Failed to Abort.');
      }
    );
  }

  closeModal() {
    this.closeStructuredDataStatusModal.emit();
    this.docStatusObject = {};
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
  }

  ngOnDestroy() {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
  }
}
