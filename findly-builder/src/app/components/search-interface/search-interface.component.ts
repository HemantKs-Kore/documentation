import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { analyzeAndValidateNgModules } from '@angular/compiler';
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
  heading_fieldData : any;
  desc_fieldData : any;
  img_fieldData : any;
  url_fieldData : any;
  fieldData : any;
  list : any =  [];
//   [{
//     id : "",
//     type : 'Actions',
//   },
//   {
//     id : "",
//     type : 'FAQs',
//   },
//   {
//     id : "",
//     type : 'Pages',
//   },
//   {
//     id : "",
//     type : 'Structured Data',
//   },
// ]
  selectedSetting = 'search';
  selectedSourceType ="Structured Data"
  preview_title = "Field Mapped for heading will appear here"
  preview_desc ="Field mapped for Description will appear here";
  selectedTemplatedId : any;
  selectedSettingResultsObj :selectedSettingResults = new selectedSettingResults();
  allSettings : any;
  settingList : any =[{
    id:"searchUi",
    text : "Search UI"
  },{
    id:"searchExperience",
    text : "Search Experience"
  },{
    id:"liveSearch",
    text : "Live Search"
  },{
    id:"search",
    text : "Search"
  },{
    id:"fullPageResult",
    text : "Full Page Result"
  }
]
  templateTypeList : any = [{
    'id' : 'listTemplate1',
    'value': 'List Template 1'
  },
  {
    'id' : 'listTemplate2',
    'value': 'List Template 2'
  },
  {
    'id' : 'listTemplate3',
    'value': 'List Template 3'
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
  clickableDisabled : boolean = false;
  switchActive : boolean = true;
  customizeTemplateObj : customizeTemplate = new customizeTemplate();
  customizeTemplate : templateResponse = new templateResponse();
  @ViewChild('customModal') customModal: KRModalComponent;
  @ViewChild('previewModal') previewModal: KRModalComponent;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.selectedApp.searchIndexes[0].pipelineId;
    // Template Response 
    // this.customizeTemplate.type = "list"
    // this.customizeTemplate.layout.layoutType = 'titleWithText'
    // this.customizeTemplate.layout.isClickable = true;
    // this.customizeTemplate.layout.behaviour="webpage";

    this.defaultTemplate();
    this.getSettings('search')
    this.getAllSettings();
    this.getFieldAutoComplete();

    console.log(this.customizeTemplateObj);
    console.log(this.selectedSettingResultsObj);
    //TEST
    // this.service.invoke('get.SI_allResultSettings', {searchIndexId : this.serachIndexId}).subscribe(res => {
    //   this.notificationService.notify('Result setting saved successfully', 'success');
    //   this.selectedTemplatedId = "";
    //   this.closeCustomModal();
    // }, errRes => {
    //   this.errorToaster(errRes, 'Failed to save result settings');
    // });
  }
  defaultTemplate(){
    this.customizeTemplateObj.template.type = "List Template 1";
    this.customizeTemplateObj.template.typeId = "listTemplate1"
    this.customizeTemplateObj.template.searchResultlayout.layout = "tileWithText";
    this.customizeTemplateObj.template.searchResultlayout.clickable = true;
    this.customizeTemplateObj.template.searchResultlayout.behaviour ="webpage";
    this.clickableDisabled = false;
  }
  getSettings(interfaceType){
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      interface : interfaceType
    };
    this.service.invoke('get.SI_settingInterface', quaryparms).subscribe(res => {
      if(res){
        this.selectedSettingResultsObj = res;
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to fetch Setting Informations');
      //this.selectedSettingResultsObj = new selectedSettingResults()
    });
  }
  getAllSettings(){
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
    };
    this.service.invoke('get.SI_setting', quaryparms).subscribe(res => {
      this.allSettings = res;
      this.list = [];
      res.settings.forEach(element => {
        if(element.interface ==this.selectedSetting){
          this.selectedSettingResultsObj = element;
          this.sourcelist(element) 
        }
      });
    }, errRes => {
      this.errorToaster(errRes, 'Failed to fetch all Setting Informations');
    });
  }
  getTemplate(templateId){
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      templateId : templateId
    };
    this.service.invoke('get.SI_searchResultTemplate', quaryparms).subscribe(res => {
      this.templateBind(res)
    }, errRes => {
      this.errorToaster(errRes, 'Failed to fetch Template');
    });
  }
  templateBind(res : any){
    if(res.type == 'grid' || res.type == 'carousel'){
      this.clickableDisabled = true;
    }else{
      this.clickableDisabled = false;
    }
    
    this.customizeTemplateObj.template.typeId = res.type;
    this.templateTypeList.forEach(element => {
      if(element.id == res.type){
       this.customizeTemplateObj.template.type = element.value;
      }
    });
    this.customizeTemplateObj.template.searchResultlayout.behaviour =  res.layout.behaviour;
    this.customizeTemplateObj.template.searchResultlayout.clickable = res.layout.isClickable
    this.customizeTemplateObj.template.searchResultlayout.layout = res.layout.layoutType;

    this.customizeTemplateObj.template.resultMapping.headingId = res.mapping.heading;
    this.heading_fieldData.forEach(element => {
      if(element._id == res.mapping.heading){
        this.customizeTemplateObj.template.resultMapping.heading = element.fieldName;
       }
    });
    this.customizeTemplateObj.template.resultMapping.descriptionId = res.mapping.description
    this.desc_fieldData.forEach(element => {
      if(element._id == res.mapping.description){
        this.customizeTemplateObj.template.resultMapping.description = element.fieldName;
       }
    });
    this.customizeTemplateObj.template.resultMapping.imageId =res.mapping.img
    this.img_fieldData.forEach(element => {
      if(element._id == res.mapping.img){
        this.customizeTemplateObj.template.resultMapping.image = element.fieldName;
       }
    });
    this.customizeTemplateObj.template.resultMapping.urlId = res.mapping.url
    this.url_fieldData.forEach(element => {
      if(element._id == res.mapping.url){
        this.customizeTemplateObj.template.resultMapping.url = element.fieldName;
       }
    });
    
    this.customModalRef = this.customModal.open();
  }
  sourcelist(settingObj){
    settingObj.appearance.forEach(element => {
      if(element.type == 'action'){
        let obj ={
          type  : "Action",
          id : element.templateId ? element.templateId : ""
        }
        this.list.push(obj)
      }else if(element.type == 'faq'){
        let obj ={
          type  : "FAQs",
          id : element.templateId ? element.templateId : ""
        }
        this.list.push(obj)
      }else if(element.type == 'page'){
        let obj ={
          type  : "Pages",
          id : element.templateId ? element.templateId : ""
        }
        this.list.push(obj)
      }else if(element.type == 'structuredData'){
        let obj ={
          type  : "Structured Data",
          id : element.templateId ? element.templateId : ""
        }
        this.list.push(obj)
      }   
    });
  }
  template(id,type){
    this.customizeTemplateObj.template.type = type;
    this.customizeTemplateObj.template.typeId = id;

    if(id == 'grid' || id == 'carousel'){
      this.clickableDisabled = true;
      this.customizeTemplateObj.template.searchResultlayout.clickable = true;
      this.customizeTemplateObj.template.searchResultlayout.behaviour = '';
    }else{
      this.clickableDisabled = false;
      this.customizeTemplateObj.template.searchResultlayout.behaviour = 'webpage';
    }
    
    //this.
  }
  resultLayoutChange(layout){
    //this.customizeTemplate.

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
  resultLayoutclickBehavior(type){
    this.customizeTemplateObj.template.searchResultlayout.behaviour = type;
  }
  clickableChange(event){
    if(event){
      this.customizeTemplateObj.template.searchResultlayout.clickable = event.target.checked; 
      this.switchActive= event.target.checked;
      if(event.target.checked){
        this.customizeTemplateObj.template.searchResultlayout.behaviour ="";
        this.customizeTemplateObj.template.searchResultlayout.url = "";
      }
    }
  }
  openCustomModal() {
    let templateId;
    this.list.forEach(element => {
      if(element.type == this.selectedSourceType){
        templateId =  element.id
      }
    });
    this.selectedTemplatedId = templateId;
    if(templateId){
      this.getTemplate(templateId);
    }else{
      this.customizeTemplateObj = new customizeTemplate();
      this.defaultTemplate();
      this.customModalRef = this.customModal.open();
    }
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
  searchlist(type,valToSearch,filedData){
      let data = []
      filedData.filter(element => {
        if(element.fieldName.includes(valToSearch)){
          data.push(element)
        }
      });
      if(valToSearch){
        if(type == 'heading'){ 
          this.heading_fieldData = [...data] 
        }else if(type == 'description'){
          this.desc_fieldData = [...data] 
        }else if(type == 'image'){
          this.img_fieldData = [...data] 
        }else if(type == 'url'){
          this.url_fieldData = [...data] 
        }
      }else{
        if(type == 'heading'){ 
          this.heading_fieldData = [...filedData] 
        }else if(type == 'description'){
          this.desc_fieldData = [...filedData] 
        }else if(type == 'image'){
          this.img_fieldData = [...filedData] 
        }else if(type == 'url'){
          this.url_fieldData = [...filedData] 
        }
      }
      
  }
  filedSelect(type,field){
    if(type == 'heading'){
      this.customizeTemplateObj.template.resultMapping.heading = field.fieldName;
      this.customizeTemplateObj.template.resultMapping.headingId = field._id;
      this.preview_title = field.fieldName
    }else if(type == 'description'){
      this.customizeTemplateObj.template.resultMapping.description = field.fieldName;
      this.customizeTemplateObj.template.resultMapping.descriptionId = field._id;
      this.preview_desc = field.fieldName
    }else if(type == 'image'){
      this.customizeTemplateObj.template.resultMapping.image = field.fieldName;
      this.customizeTemplateObj.template.resultMapping.imageId = field._id;
    }else if(type == 'url'){
      this.customizeTemplateObj.template.resultMapping.url = field.fieldName;
      this.customizeTemplateObj.template.resultMapping.urlId = field._id;
    }
  }
  saveResultSettings(){
    let queryparams = {
      searchIndexId : this.serachIndexId
    };
    let payload =  {
      "_id": this.selectedSettingResultsObj._id,
       "resultClassification": {
         "isEnabled": this.selectedSettingResultsObj.resultClassification.isEnabled,
         "sourceType": this.selectedSettingResultsObj.resultClassification.sourceType
            },
          "view": this.selectedSettingResultsObj.view,
          "maxResultsAllowed": this.selectedSettingResultsObj.maxResultsAllowed,
          "interface": this.selectedSetting,
          "appearance": this.selectedSettingResultsObj.appearance
          // [
          //       {
          //           "type": "action"
          //       },
          //       {
          //           "type": "faq"
          //       },
          //       {
          //           "type": "pages"
          //       },
          //       {
          //           "type": "structuredData"
          //       }
          //   ],  
   }
  
    this.service.invoke('put.SI_saveResultSettings', queryparams , payload).subscribe(res => {
      this.notificationService.notify('Result setting saved successfully', 'success');
      this.selectedTemplatedId = "";
      this.closeCustomModal();
    }, errRes => {
      this.errorToaster(errRes, 'Failed to save result settings');
    });
  }
  saveTemplate(){
    let url :any;
    let payload :any;
    let queryparams :any;
    let appearnce : any;
    let message : any;
    if(this.selectedSourceType == 'Action'){
      appearnce =  'action';
    }else if(this.selectedSourceType == 'FAQs'){
      appearnce =  'faq';
    }else if(this.selectedSourceType == 'Pages'){
      appearnce =  'page';
    }else if(this.selectedSourceType == 'Structured Data'){
      appearnce =  'structuredData';
    }
    payload = {
      "type": this.customizeTemplateObj.template.typeId,
      "layout": {
      "layoutType":this.customizeTemplateObj.template.searchResultlayout.layout,
      "isClickable":this.customizeTemplateObj.template.searchResultlayout.clickable,
      "behaviour":this.customizeTemplateObj.template.searchResultlayout.behaviour
          },
        "mapping": {
        "heading":this.customizeTemplateObj.template.resultMapping.headingId,
        "description": this.customizeTemplateObj.template.resultMapping.descriptionId,
        "img":this.customizeTemplateObj.template.resultMapping.imageId,
        "url":this.customizeTemplateObj.template.resultMapping.urlId
        },
        "appearanceType":appearnce
    }
    if(this.selectedTemplatedId){
      url = "put.SI_saveTemplate_Id";
      queryparams = {
        searchIndexId : this.serachIndexId,
        templateId  : this.selectedTemplatedId
      }
      delete payload['appearanceType'];
      message = "Template Updated Successfully"
    }else{
      url = "post.SI_saveTemplate";
      queryparams = {
        searchIndexId : this.serachIndexId,
        interface  : this.selectedSetting
      }
      message = "Template Added Successfully"
    }
    this.service.invoke(url, queryparams , payload).subscribe(res => {
      this.notificationService.notify(message, 'success');
      this.selectedTemplatedId = "";
      this.getSettings(this.selectedSetting);
      this.closeCustomModal();
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get fields');
    });
  }
  getFieldAutoComplete() {
    let query: any = '';
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      query
    };
    this.service.invoke('get.getFieldAutocomplete', quaryparms).subscribe(res => {
      this.heading_fieldData =  res;
      this.desc_fieldData =  res;
      this.img_fieldData =  res;
      this.url_fieldData =  res;
      this.fieldData = res;
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

/** Setting Class **/

class selectedSettingResults{
  _id = ""
  resultClassification = {
      'isEnabled' : true,
      'sourceType' : "dataContentType"
  }
  view= "fit"
  maxResultsAllowed= 10
  interface= "search"
  appearance= [
      {
          "type": "action",
          "templateId": ""
      },
      {
          "type": "faq",
          "templateId": ""
      },
      {
          "type": "page",
          "templateId": ""
      },
      {
          "type": "structuredData",
          "templateId": ""
      }
  ]
  streamId= ""
  searchIndexId= ""
  createdOn= ""
  orderBasedOnRelevance= false
  }


/** Template Class **/
class customizeTemplate{ 
    template : template = new template();
}
class template {
  type : string = '';
  typeId : string = '';                    // list1  list 2 or card or carousel
  searchResultlayout : searchResultlayout = new searchResultlayout();
  resultMapping :resultMapping = new resultMapping();
  preview : string = '';                 // collapsable / clickable
}
class searchResultlayout{
  layout :string = '';                // title with text / image / Centered Content
    clickable : boolean = true;
    behaviour : string = 'webpage';          // 'webpage' or 'postback'
    url : string = '';
}
class resultMapping{
  heading : string = '';
  headingId : string = '';
  description : string = '';
  descriptionId : string = '';
  image : string = '';
  imageId :string ='';
  url : string = '';
  urlId : string = '';
}

/** Template API Response Class */
class templateResponse{
  "_id"= ""
"layout"= {
    	"layoutType": "tileWithText",
       		"isClickable": false,
       		"behaviour": "webpage"
   	}
   	"type"= "" // grid , list
   	"mapping"= {
       		"heading": "",  // ids
       		"description": "",  // ids
       		"img": "",  // ids
       		"url": ""  // ids or free text
   	}
   	"createdBy"= ""
   	"createdOn"= ""
   	"searchIndexId"= ""
   	"streamId"= ""
   	"lModifiedOn"= ""
   	"__v": 0
}

