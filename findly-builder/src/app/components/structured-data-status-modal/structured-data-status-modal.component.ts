import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-structured-data-status-modal',
  templateUrl: './structured-data-status-modal.component.html',
  styleUrls: ['./structured-data-status-modal.component.scss']
})
export class StructuredDataStatusModalComponent implements OnInit {

  @Output() closeStructuredDataStatusModal = new EventEmitter();

  constructor(private notificationService: NotificationService,
    private service: ServiceInvokerService,
    private authService: AuthService,
    public workflowService: WorkflowService,
    private router: Router) { }

  docStatusObject : any = {};

  ngOnInit(): void {
    // this.polling();
  }

  closeModal(){
    this.closeStructuredDataStatusModal.emit();
  }

}
