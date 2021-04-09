import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { AuthService } from '@kore.services/auth.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { analyzeAndValidateNgModules } from '@angular/compiler';
@Component({
  selector: 'app-small-talk',
  templateUrl: './small-talk.component.html',
  styleUrls: ['./small-talk.component.scss']
})
export class SmallTalkComponent implements OnInit {
  searchIndexId:any;
  selectedApp: any;
  LinkABot:any;
  streamId:any;
  enableSmallTalk:any;
  enable: boolean;
  botLinked = false;
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
  ) { 
  
  }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getAssociatedTasks();
  }
  
// getBots() {
//   if (this.streamId) {
//     const quaryparms: any = {
//       streamId: this.streamId
//     };
//     this.service.invoke('get.bots', quaryparms).subscribe(res => {
//       console.log(res)
//     }, errRes => {
//       this.notificationService.notify("Error in loading bot action", 'error');

//     });
//   }

// }
  getAssociatedTasks() {
    if (this.searchIndexId) {
      const queryParams: any = {
        searchIndexID: this.searchIndexId
      };
      this.service.invoke('get.AssociatedBotTasks', queryParams, null, { "state": "published" }).subscribe(res => {
        console.log("getAllTasks API response payload", res);
      },
        (err) => {
        },
      )}
  }
 enableST(type) {
   const queryParams: any = {
     searchIndexID: this.searchIndexId
   };
   let payload: any = {
     stEnabled: type
   }
   this.service.invoke('put.enableTask', queryParams, payload).subscribe(res => {
     if (this.enable = true) {
       payload.stEnabled = true;
     }
     else if (this.enable = false){
       payload.stEnabled = false;
     }


     console.log(res);
   },
     (err) => { this.notificationService.notify("Task Enabling Failedd", 'error') });

 }

}
