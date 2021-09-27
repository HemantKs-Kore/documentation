import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { SideBarService } from '@kore.services/header.service';
import { InlineManualService } from '@kore.services/inline-manual.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-result-templates',
  templateUrl: './result-templates.component.html',
  styleUrls: ['./result-templates.component.scss']
})
export class ResultTemplatesComponent implements OnInit {
  customModalRef: any;
  selectedApp: any;
  serachIndexId: any;
  indexPipelineId: any;
  allFieldsData: any;
  // heading_fieldData: any;
  // desc_fieldData: any;
  // img_fieldData: any;
  // url_fieldData: any;
  //fieldData: any;
  templateData: any;
  subscription: Subscription;
  searchConfigurationSubscription: Subscription;
  searchExperienceConfig: any = {};
  searchTemplatesDisabled: boolean = false;
  fieldPopupType: string;
  selectedTab: string = 'fullSearch';
  tabList: any = [{ id: "liveSearch", name: "Live Search" }, { id: "conversationalSearch", name: "Conversational Search" }, { id: "fullSearch", name: "Full Page Result" }]
  resultListObj: any = {
    facetsSetting: {
      aligned: 'left',
      enabled: false
    },
    groupResults: false,
    groupSetting: {
      fieldId: '', fieldName: '',
      conditions: []
    }
  };
  fieldValues: any;
  templateNames: any = ['list', 'carousel', 'grid'];
  filterFacets: any = [{ name: 'Left Aligned', type: 'left' }, { name: 'Right Aligned', type: 'right' }, { name: 'Top Aligned', type: 'top' }]
  @ViewChild('customModal') customModal: KRModalComponent;
  constructor(public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private appSelectionService: AppSelectionService,
    public dialog: MatDialog,
    public headerService: SideBarService,
    public inlineManual: InlineManualService,
  ) { }

  ngOnInit(): void {
    //Initializing Id's
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();

    this.loadFiledsData();
    this.subscription = this.appSelectionService.appSelectedConfigs.subscribe(res => {
      this.loadFiledsData();
    })
    this.searchExperienceConfig = this.headerService.searchConfiguration;
    this.searchConfigurationSubscription = this.headerService.savedSearchConfiguration.subscribe((res) => {
      this.searchExperienceConfig = res;
      this.updateResultTemplateTabsAccess();
    });
    this.updateResultTemplateTabsAccess();
    /** Inline Not yet Registered */
    if (!this.inlineManual.checkVisibility('RESULT_TEMPLATE') && false) {
      this.inlineManual.openHelp('RESULT_TEMPLATE')
      this.inlineManual.visited('RESULT_TEMPLATE')
    }
  }

  loadFiledsData() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.getFieldAutoComplete();
      // this.getAllSettings(this.selectedTab)
    }
  }
  /** Fields Data for options  */
  getFieldAutoComplete() {
    let query: any = '';
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      query
    };
    this.service.invoke('get.getFieldAutocomplete', quaryparms).subscribe(res => {
      // this.heading_fieldData = [...res];
      // this.desc_fieldData = [...res];
      // this.img_fieldData = [...res];
      // this.url_fieldData = [...res];
      // this.fieldData = [...res];
      this.allFieldsData = res;
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get fields');
    });
  }
  /** Chat SDK approach and by-default Data */
  updateResultTemplateTabsAccess() {
    if (this.searchExperienceConfig && Object.values(this.searchExperienceConfig).length) {
      console.log(this.searchExperienceConfig);
      if (this.searchExperienceConfig && this.searchExperienceConfig.experienceConfig && this.searchExperienceConfig.experienceConfig.searchBarPosition) {
        if (this.searchExperienceConfig.experienceConfig.searchBarPosition === 'top') {
          this.searchTemplatesDisabled = true;
          this.getAllSettings(this.selectedTab);
        }
        else {
          this.searchTemplatesDisabled = false;
        }
      }
    }
    else {
      this.searchTemplatesDisabled = false;
    }
  }
  /** Call for All Setting Templates */
  getAllSettings(setting) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      interface: setting
    };
    this.service.invoke('get.settingsByInterface', quaryparms).subscribe(res => {
      this.resultListObj = res;
      const obj = { _id: this.resultListObj.groupSetting.fieldId, fieldName: this.resultListObj.groupSetting.fieldName };
      this.getFieldValues(obj);
    }, errRes => {
      this.errorToaster(errRes, 'Failed to fetch all Setting Informations');
    });
    //get.settingsById
    // update.settings
    // copy.settings
    // new.template
    // get.templateById
    // update.template
  }
  getTemplate(templateId) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      templateId: templateId,
      indexPipelineId: this.indexPipelineId
    };
    this.service.invoke('get.templateById', quaryparms).subscribe(res => {
    }, errRes => {
      this.errorToaster(errRes, 'Failed to fetch Template');
    });
  }
  //open add/edit fields dialog
  openCustomModal(type) {
    this.fieldPopupType = type;
    this.customModalRef = this.customModal.open();
  }
  //close 
  closeCustomModal() {
    if (this.customModalRef && this.customModalRef.close) {
      this.customModalRef.close();
      if (this.fieldPopupType === 'add') {
        this.resultListObj.groupSetting.fieldName = '';
        this.resultListObj.groupSetting.fieldId = '';
      }
    }
  }
  //get all templates
  // getAllTemplates() {
  //   const quaryparms: any = {
  //     searchIndexId: this.serachIndexId,
  //     indexPipelineId: this.indexPipelineId
  //   };
  //   this.service.invoke('get.templates', quaryparms).subscribe(res => {
  //     console.log("templates", res)
  //   }, errRes => {
  //     this.errorToaster(errRes, 'Failed to fetch Template');
  //   });
  // }
  //get values based on field
  getFieldValues(field) {
    this.fieldValues = [];
    this.resultListObj.groupSetting.fieldName = field.fieldName;
    this.resultListObj.groupSetting.fieldId = field._id;
    const quaryparms: any = {
      sidx: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      fieldId: field._id
    };
    this.service.invoke('get.facetValues', quaryparms).subscribe(res => {
      console.log("getFieldValues res", res);
      this.fieldValues = res.values;
      // if (res.values.length) {
      //   res.values.forEach(ele => {
      //     const obj = { fieldValue: ele, templateId: '' }
      //     this.resultListObj.groupSetting.conditions.push(obj);
      //   })
      // }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get field values');
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
  //new result template based on template type
  getTemplateData(type) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    };
    const payload = { type: type };
    this.service.invoke('post.templates', quaryparms, payload).subscribe(res => {
      console.log("getFieldValues res", res);
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get field values');
    });
  }
  //add new templates values row dynamically
  addNewTemplateValues(type, index?) {
    if (type === 'add') {
      this.resultListObj.groupSetting.conditions.push({ fieldValue: '', templateType: '' })
    }
    else if (type === 'delete') {
      this.resultListObj.groupSetting.conditions.splice(index, 1);
    }
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.searchConfigurationSubscription ? this.searchConfigurationSubscription.unsubscribe() : false;
  }
}
