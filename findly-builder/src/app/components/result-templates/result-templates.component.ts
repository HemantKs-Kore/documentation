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
  templateModalRef: any;
  selectedApp: any;
  copyConfigObj: any = { loader: false, message: '' };
  serachIndexId: any;
  indexPipelineId: any;
  allFieldData: any;
  preview_title: any;
  preview_desc: any;
  preview_img: any;
  preview_url: any;
  templateDataBind: any = {
    layout: {
      behaviour: "webpage",
      isClickable: true,
      layoutType: "l1",
      listType: "classic",
      renderTitle: true,
      textAlignment: "left",
      title: "Web Pages",
    },
    mapping: {
      description: "fld-e2c3b9e8-69a7-5510-a355-d6a8904f33ec",
      heading: "fld-7f79d838-7230-58cb-bb3c-95f438bb8d3d",
      img: "fld-1ed42ad4-e565-58ce-8869-7757420bc793",
      url: "fld-40c5ab74-c5af-5a45-be4e-3859e6f62134",
      searchIndexId: "sidx-e3de5037-033f-5bc1-95ff-b1e252f2b1eb",
    },
    type: ''
  };
  templateDatalistext: any;
  customtemplateBtndisable: boolean = false;
  heading_fieldData: any;
  desc_fieldData: any;
  img_fieldData: any;
  url_fieldData: any;
  fieldData: any;
  templateData: any;
  subscription: Subscription;
  searchConfigurationSubscription: Subscription;
  searchExperienceConfig: any = {};
  searchTemplatesDisabled: boolean = false;
  fieldPopupType: string;
  fieldPopup: boolean = false;
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
  @ViewChild('templateModal') templateModal: KRModalComponent;
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
      this.heading_fieldData = [...res];
      this.desc_fieldData = [...res];
      this.img_fieldData = [...res];
      this.url_fieldData = [...res];
      this.fieldData = [...res];
      this.allFieldData = res;
      console.log('Field Data ....', res)
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get fields');
    });
  }
  /** Field Selection */
  filedSelect(type, field) {
    if (type == 'heading') {
      this.templateDataBind.mapping.heading = field._id
      // this.customizeTemplateObj.template.resultMapping.heading = field.fieldName;
      // this.customizeTemplateObj.template.resultMapping.headingId = field._id;
      this.preview_title = field.fieldName;
      this.heading_fieldData = [...this.allFieldData];
    } else if (type == 'description') {
      this.templateDataBind.mapping.description = field._id;
      this.preview_desc = field.fieldName;
      this.desc_fieldData = [...this.allFieldData];
    } else if (type == 'image') {
      this.templateDataBind.mapping.img = field._id;
      this.preview_img = field.fieldName;
      this.img_fieldData = [...this.allFieldData];
    } else if (type == 'url') {
      this.templateDataBind.mapping.url = field._id;
      this.preview_url = field.fieldName;
      this.url_fieldData = [...this.allFieldData];
    }
  }
  searchlist(type, valToSearch, filedData) {
    let data = []
    filedData.filter(element => {
      if (element.fieldName.includes(valToSearch)) {
        data.push(element)
      }
    });
    if (valToSearch) {
      if (type == 'heading') {
        this.heading_fieldData = [...data]
      } else if (type == 'description') {
        this.desc_fieldData = [...data]
      } else if (type == 'image') {
        this.img_fieldData = [...data]
      } else if (type == 'url') {
        this.url_fieldData = [...data]
      }
    } else {
      if (type == 'heading') {
        this.heading_fieldData = [...filedData]
      } else if (type == 'description') {
        this.desc_fieldData = [...filedData]
      } else if (type == 'image') {
        this.img_fieldData = [...filedData]
      } else if (type == 'url') {
        this.url_fieldData = [...filedData]
      }
    }

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
  getTemplate(templateData) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      templateId: templateData.templateId,
      indexPipelineId: this.indexPipelineId
    };
    this.service.invoke('get.templateById', quaryparms).subscribe((res: any) => {
      this.templateDataBind = res;
      let listTypeText = ""
      res.layout.listType == "classic" ? listTypeText = 'Classic List' : 'Plain List';
      this.templateDatalistDisplay(listTypeText);
      this.fieldsDisplay(res.mapping);
      this.openTemplateModal();
    }, errRes => {
      this.errorToaster(errRes, 'Failed to fetch Template');
    });
  }
  //
  templateDatalistDisplay(type) {
    this.templateDatalistext = type
  }
  fieldsDisplay(mapping) {
    // this.heading_fieldData
    //   this.desc_fieldData 
    //   this.img_fieldData 
    //   this.url_fieldData

    for (const property in mapping) {
      console.log(`${property}: ${mapping[property]}`);
      this.fieldData.forEach(element => {
        if (`${property}` == 'heading' && element._id == `${mapping[property]}`) {
          this.preview_title = element.fieldName;
        } else if (`${property}` == 'description' && element._id == `${mapping[property]}`) {
          this.preview_desc = element.fieldName;
        } else if (`${property}` == 'img' && element._id == `${mapping[property]}`) {
          this.preview_img = element.fieldName;
        } else if (`${property}` == 'url' && element._id == `${mapping[property]}`) {
          this.preview_url = element.fieldName;
        }
      });
    }

  }
  /** type selection */
  templateTypeSelection(layoutType) {
    this.templateDataBind.layout.layoutType = layoutType;
  }
  renderTitleChange() {
    this.templateDataBind.layout.renderTitle = !this.templateDataBind.layout.renderTitle
  }
  clickableChange() {
    this.templateDataBind.layout.isClickable = !this.templateDataBind.layout.isClickable
  }
  clickBehaviorChange(behaviour) {
    this.templateDataBind.layout.behaviour = behaviour;
  }
  //Open Template Modal
  openTemplateConatiner(templateData) {
    this.customtemplateBtndisable = true;
    console.log(templateData)
    this.getTemplate(templateData)
  }

  //open add/edit fields dialog
  openCustomModal(type) {
    this.fieldPopupType = type;
    this.customModalRef = this.customModal.open();
  }

  //open template Modal
  openTemplateModal() {
    this.templateModalRef = this.templateModal.open();
  }

  //Close templateModal
  closeTemplateModal() {
    if (this.templateModalRef && this.templateModalRef.close) {
      this.templateModalRef.close();
    }
  }
  //close CustomModal
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
  //copy configuration method
  copyConfiguration(type, tab) {
    if (type === 'open') {
      this.copyConfigObj.loader = true;
      const quaryparms: any = {
        searchIndexId: this.serachIndexId,
        indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
        settingsId: this.resultListObj._id,
        fromInterface: tab
      };
      const payload = this.resultListObj;
      this.service.invoke('copy.settings', quaryparms, payload).subscribe(res => {
        this.copyConfigObj.loader = false;
        this.copyConfigObj.message = 'Configurations applied from Live Search | 10 Jul 2020, 10:00 a.m.'
        this.notificationService.notify(' Result copied successfully', 'success')
      }, errRes => {
        this.copyConfigObj.loader = false;
        this.copyConfigObj.message = 'Configurations applied from Live Search | 10 Jul 2020, 10:00 a.m.'
        this.errorToaster(errRes, 'Failed to get field values');
      });
    }
    else if (type === 'close') {
      this.copyConfigObj = { loader: false, message: '' };
    }
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.searchConfigurationSubscription ? this.searchConfigurationSubscription.unsubscribe() : false;
  }
}
