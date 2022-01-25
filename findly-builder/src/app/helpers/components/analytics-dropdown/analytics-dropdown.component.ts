import { Component, OnInit,Output,Input,EventEmitter } from '@angular/core';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AppSelectionService } from '@kore.services/app.selection.service'; //imported on 17/01
import { NotificationService } from '@kore.services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analytics-dropdown',
  templateUrl: './analytics-dropdown.component.html',
  styleUrls: ['./analytics-dropdown.component.scss']
})
export class AnalyticsDropdownComponent implements OnInit {

  selectedApp;
  serachIndexId;
  indexConfigs: any = [];
  selectedIndexConfig: any; 
  selecteddropname: any;
  indexConfigObj: any = {};
  @Output() dropdownpipelineid = new EventEmitter();
  @Input() indexarray;

  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private router: Router,
    private appSelectionService: AppSelectionService,//added on 17/01
    private notificationService: NotificationService) { }

  ngOnInit(): void {

    this.selectedApp = this.workflowService.selectedApp();
    this.indexConfigs = this.appSelectionService.appSelectedConfigs;
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    //this.getIndexPipeline();
    this.indexConfigs=this.indexarray;
    this.indexConfigs.forEach((element,index) => {
      this.indexConfigObj[element._id] = element;
      if(element.default=== true){
        this.selecteddropname=element.name;           
      }
     });
     
  }

  getDetails(config?){
    this.selecteddropname=config.name;
    this.selectedIndexConfig=config._id;
    this.dropdownpipelineid.emit(this.selectedIndexConfig);
   
  }

}
