import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';

@Component({
  selector: 'app-structured-data',
  templateUrl: './structured-data.component.html',
  styleUrls: ['./structured-data.component.scss']
})
export class StructuredDataComponent implements OnInit {

  addStructuredDataModalPopRef : any;
  selectedSourceType: any;
  availableSources = [
    {
      name: 'Import Structured Data',
      description: 'Import from JSON or CSV',
      icon: 'assets/icons/content/database-Import.svg',
      id: 'contentStucturedDataImport',
      sourceType: 'json',
      resourceType: 'structuredData'
    },
    {
      name: 'Import Structured Data',
      description: 'Add structured data manually',
      icon: 'assets/icons/content/database-add.svg',
      id: 'contentStucturedDataAdd',
      sourceType: 'json',
      resourceType: 'structuredDataManual'
    }
  ];
  structuredDataItemsList : any = [];
  selectedApp: any;
  codeMirrorOptions: any = {
    theme: 'neo',
    mode: "json",
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: false,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: false,
    indentUnit: 0,
    readOnly:'nocursor'
  };

  @ViewChild('addStructuredDataModalPop') addStructuredDataModalPop: KRModalComponent;

  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.getStructuredDataList();
  }

  getStructuredDataList(skip?){
    const searchIndex = this.selectedApp.searchIndexes[0]._id;
    const quaryparms: any = {
      searchIndexId: searchIndex,
      skip: 0,
      limit : 20
    };
    if(skip){
      quaryparms.skip = skip;
    }
    this.service.invoke('get.structuredData', quaryparms).subscribe(res => {
      console.log("res", res);
      this.structuredDataItemsList = res;
      this.structuredDataItemsList.forEach(data => {
        if(data._source.jsonData){
          data._source.parsedData = JSON.stringify(data._source.jsonData, null, 1);
        }
      });
    }, errRes => {
      console.log("error", errRes);
    });
  }

  paginate(event){
    console.log("event", event);
    if(event.skip){
      this.getStructuredDataList(event.skip);
    }
  }

  openAddStructuredData(key){
    this.selectedSourceType = this.availableSources.find((s) =>{ if(s.resourceType === key){ return s}});
    console.log("this.selectedSourceType", this.selectedSourceType);
    this.addStructuredDataModalPopRef = this.addStructuredDataModalPop.open();
  }

  cancleSourceAddition() {
    this.selectedSourceType = null;
    this.closeStructuredDataModal();
  }

  closeStructuredDataModal(){
    if (this.addStructuredDataModalPopRef && this.addStructuredDataModalPopRef.close) {
      this.addStructuredDataModalPopRef.close();
    }
  }

}
