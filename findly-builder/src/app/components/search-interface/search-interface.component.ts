import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';

@Component({
  selector: 'app-search-interface',
  templateUrl: './search-interface.component.html',
  styleUrls: ['./search-interface.component.scss']
})
export class SearchInterfaceComponent implements OnInit {
  customModalRef:any;
  previewModalRef:any;
  selectedApp : any;
  serachIndexId:any;
  indexPipelineId : any;
  fieldData : any;
  list : any = ['Actions','FAQs','Pages','Structured Data'];
  templateTypeList : any = [{
    'id' : 'listTemp1',
    'value': 'List Templte 1'
  },
  {
    'id' : 'listTemp2',
    'value': 'List Templte 2'
  },
  {
    'id' : 'listTemp3',
    'value': 'List Templte 3'
  },
  {
    'id' : 'grid',
    'value': 'Grid'
  },
  {
    'id' : 'carousel',
    'value': 'Carousel'
  }]
  showDescription: boolean = true;
  showImage : boolean = false;
  customizeTemplateObj : customizeTemplate = new customizeTemplate();
  @ViewChild('customModal') customModal: KRModalComponent;
  @ViewChild('previewModal') previewModal: KRModalComponent;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.selectedApp.searchIndexes[0].pipelineId;
    this.customizeTemplateObj.template.type = "list";
    this.customizeTemplateObj.template.searchResultlayout.layout = "titleWithText";
    this.customizeTemplateObj.template.searchResultlayout.clickable = true;
    this.customizeTemplateObj.template.searchResultlayout.behaviour  ="webpage";
  }
  template(type){
    this.customizeTemplateObj.template.type = type;
    //this.
  }
  resultLayoutChange(layout){
    this.customizeTemplateObj.template.searchResultlayout = new searchResultlayout();
    this.customizeTemplateObj.template.resultMapping = new resultMapping();
    this.customizeTemplateObj.template.searchResultlayout.layout = layout;
    if(layout == 'titleWithHeader'){
      this.showDescription = false;
    }else{
      this.showDescription = true;
    }
    if(layout == 'titleWithHeader' || layout == 'titleWithText'){
      this.showImage = false;
    }else{
      this.showImage = true;
    }
  }
  clickableChange(event){
    if(event){
      this.customizeTemplateObj.template.searchResultlayout.clickable = event.target.checked;
    }
  }
  openCustomModal() {
    this.customModalRef = this.customModal.open();
  }
  closeCustomModal(){
    if (this.customModalRef && this.customModalRef.close){
      this.customModalRef.close();
    }
  }
  openPreviewModal() {
    this.previewModalRef = this.previewModal.open();
  }
  closePreviewModal(){
    if (this.previewModalRef && this.previewModalRef.close){
      this.previewModalRef.close();
    }
  }
  drop(event: CdkDragDrop<string[]>,list) {
    moveItemInArray(list, event.previousIndex, event.currentIndex);
  }
  getFieldAutoComplete() {
    let query: any = '';
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      query
    };
    this.service.invoke('get.getFieldAutocomplete', quaryparms).subscribe(res => {
      this.fieldData =  res;
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get fields');
    });
  }
  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
}

class customizeTemplate{ 
    template : template = new template();
}
class template {
  type : string = '';                    // list1  list 2 or card or carousel
  searchResultlayout : searchResultlayout = new searchResultlayout();
  resultMapping :resultMapping = new resultMapping();
  preview : string = '';                 // collapsable / clickable
}
class searchResultlayout{
  layout :string = '';                // title with text / image / Centered Content
    clickable : boolean = true;
    behaviour : string = '';          // 'webpage' or 'postback'
    url : string = '';
}
class resultMapping{
  heading : string = '';
  Description : string = '';
  image : string = '';
}