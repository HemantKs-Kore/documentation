import { Component, OnInit, ElementRef } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

import { SideBarService } from '@kore.services/header.service';
import { finalize } from 'rxjs/operators';

declare const $: any;

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {
  toShowAppHeader: boolean;
  selectedApp: any;
  
  comments: string = "";
  submitted: boolean;

  allowSave: boolean = true;
  successMsg: string;
  errorMsg: string;
  constructor(private service: ServiceInvokerService,
    public workflowService: workflowService,
    private el: ElementRef,
    private router: Router,
    private NotificationService: NotificationService,
    private headerService: SideBarService

  ) { }

  ngOnInit() {
    let toogleObj = {
      "title": "Publish",
      "toShowWidgetNavigation": this.workflowService.showAppCreationHeader()
    }
    this.toShowAppHeader = this.workflowService.showAppCreationHeader();
    this.selectedApp = this.workflowService.deflectApps();
    this.headerService.toggle(toogleObj);

  }

  publish(flag?) {
    if (!this.allowSave) { return; }
    this.submitted = true;
    let routeFlag = flag;
    let comm = this.comments;
    let _params = {
      'appId': this.selectedApp._id || this.selectedApp[0]._id
    };
    if (comm.trim() == "") {
      // this.NotificationService.notify("Please provide comments", "error");
      this.errorMsg = "Please provide comments";
      setTimeout(() => this.errorMsg = "", 2000)
      return;
    }
    let payload = {
      versionComment: comm
    };
    this.allowSave = false;
    this.service.invoke('post.publish', _params, payload)
      .pipe(finalize(() => {
        this.allowSave = true;
        setTimeout(() => { this.successMsg = ""; this.errorMsg = "" }, 5000);
      }))
      .subscribe(
        res => {
          if (routeFlag) {
            this.router.navigate(['/summary'])
            this.workflowService.showAppCreationHeader(false);
            $(".toShowAppHeader").removeClass('d-none');
            $(".progressbar").addClass('d-none');
            $(".currentTitle").removeClass('d-none');
            $(".defaultTitleName").addClass('d-none');
            $(".deflectHeader").removeClass('headerCreation');
          }
          this.NotificationService.notify('Published successfully', 'success');
          // this.successMsg = "Published successfully.";
        },
        err => {
          // this.NotificationService.notify('Failed to publish', 'error');
          const errMsg = err.error.errors && err.error.errors[0] && err.error.errors[0].msg;
          this.errorMsg = errMsg || "Failed to publish";
          // console.error('Failed in singing out');
        }
      );
  }
}
