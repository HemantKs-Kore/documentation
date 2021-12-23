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
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import * as moment from 'moment';
declare const $: any;
@Component({
  selector: 'app-result-templates',
  templateUrl: './result-templates.component.html',
  styleUrls: ['./result-templates.component.scss']
})
export class ResultTemplatesComponent implements OnInit {
  customModalRef: any;
  templateModalRef: any;
  selectedApp: any;
  field_name:string;
  copyConfigObj: any = { loader: false, message: '' };
  serachIndexId: any;
  indexPipelineId: any;
  allFieldData: any;
  preview_title: any = '';
  preview_desc: any = '';
  preview_img: any = '';
  preview_url: any = '';
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
      description: "",
      heading: "",
      img: "",
      url: "",
      searchIndexId: "",
    },
    type: ''
  };
  templateFieldValidateObj = {
    heading: true,
    description: true,
    image: true,
    url: true
  }
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
  submitted: boolean = false;
  selectedTab: string = 'fullSearch';
  selectedTemplateName: string;
  postback: string = '';
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
  settingsId: string;
  selectedGroupName: string;
  defaultFieldName: string;
  tabData: any;
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
  //selected tab method
  tabSelection(id) {
    this.getAllSettings(id);
    this.selectedTab = id;
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
      this.preview_title = field.fieldName;
      this.heading_fieldData = [...this.allFieldData];
      this.templateFieldValidateObj.heading = true;
    } else if (type == 'description') {
      this.templateDataBind.mapping.description = field._id;
      this.preview_desc = field.fieldName;
      this.desc_fieldData = [...this.allFieldData];
      this.templateFieldValidateObj.description = true;
    } else if (type == 'image') {
      this.templateDataBind.mapping.img = field._id;
      this.preview_img = field.fieldName;
      this.img_fieldData = [...this.allFieldData];
      this.templateFieldValidateObj.image = true;
    } else if (type == 'url') {
      this.templateDataBind.mapping.url = field._id;
      this.preview_url = field.fieldName;
      this.url_fieldData = [...this.allFieldData];
      this.templateFieldValidateObj.url = true;
    }
  }
  searchlist(type, valToSearch, filedData) {
    let data = []
    filedData.filter(element => {
      var filedNamelower = element.fieldName.toLocaleLowerCase();
      var valToSearchlower = valToSearch.toLocaleLowerCase();
      if (filedNamelower.includes(valToSearchlower)) {
        data.push(element)
      }
    });
    // filedData.filter(element => {
    //   if (element.fieldName.includes(valToSearch)) {
    //     data.push(element)
    //   }
    // });
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
    console.log("searchExperienceConfig", this.searchExperienceConfig)
    if (this.searchExperienceConfig && Object.values(this.searchExperienceConfig).length) {
      if (this.searchExperienceConfig && this.searchExperienceConfig.experienceConfig && this.searchExperienceConfig.experienceConfig.searchBarPosition) {
        this.searchTemplatesDisabled = this.searchExperienceConfig.experienceConfig.searchBarPosition === 'top' ? true : false;
        this.getAllSettings(this.selectedTab);
        if (this.searchTemplatesDisabled) {
          this.filterFacets = this.filterFacets.filter(res => res.type !== 'right');
        }
      }
    }
    else {
      this.searchTemplatesDisabled = false;
    }
  }
  /** Call for All Setting Templates */
  getAllSettings(setting, type?) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      interface: setting
    };
    this.service.invoke('get.settingsByInterface', quaryparms).subscribe(res => {
      this.resultListObj = res;
      this.defaultFieldName = this.resultListObj.groupSetting.fieldName;
      this.settingsId = res._id;
      const obj = { _id: this.resultListObj.groupSetting.fieldId, fieldName: this.resultListObj.groupSetting.fieldName };
      this.getFieldValues(obj);
      if (type === 'emptycondition') {
        this.addNewTemplateValues('add');
      }
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
  getTemplate(templateData, type) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      templateId: templateData.templateId,
      indexPipelineId: this.indexPipelineId
    };
    this.service.invoke('get.templateById', quaryparms).subscribe((res: any) => {
      this.templateDataBind = res;
      if (type === 'modal') {
        this.templateDatalistext = res.layout.listType == "classic" ? 'Classic List' : 'Plain List';
        this.fieldsDisplay(res.mapping);
        this.openTemplateModal();
        this.templateTypeSelection(res.layout.layoutType);
        if (this.templateDataBind.layout.behaviour === 'postback') {
          this.postback = this.templateDataBind.layout.postbackUrl;
        }
      }
      this.customtemplateBtndisable = false;
    }, errRes => {
      this.customtemplateBtndisable = false;
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
    this.submitted = false;
  }
  renderTitleChange() {
    this.templateDataBind.layout.renderTitle = !this.templateDataBind.layout.renderTitle;
  }
  clickableChange() {
    this.templateDataBind.layout.isClickable = !this.templateDataBind.layout.isClickable;
    this.templateDataBind.layout.behaviour = 'webpage';
  }
  clickBehaviorChange(behaviour) {
    this.templateDataBind.layout.behaviour = behaviour;
  }
  //Open Template Modal
  openTemplateConatiner(templateData, type) {
    const templateName = this.tabList.filter(data => data.id == this.selectedTab);
    this.selectedTemplateName = templateName[0].name;
    this.selectedGroupName = templateData?.templateId ? (templateData?.fieldValue) : (templateData?.defaultTemplateType);
    this.customtemplateBtndisable = true;
    if (templateData?.templateId) {
      this.getTemplate(templateData, type)
    }
    else {
      this.getTemplate({ templateId: templateData?.defaultTemplateId }, type);
    }
    this.preview_title = '';
    this.preview_desc = '';
    this.preview_img = '';
    this.preview_url = '';
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
      else if (this.fieldPopupType === 'edit') {
        this.resultListObj.groupSetting.fieldName = this.defaultFieldName;
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
  getTemplateData(type, index?) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    };
    const payload = { type: type };
    this.service.invoke('post.templates', quaryparms, payload).subscribe(res => {
      if (index === 'default') {
        this.resultListObj.defaultTemplateType = type;
        this.resultListObj.defaultTemplateId = res._id;
      }
      else {
        this.resultListObj.groupSetting.conditions[index].templateId = res._id;
      }
      this.updateSettings();
    }, errRes => {
      this.errorToaster(errRes, 'Failed to get field values');
    });
  }
  //add new templates values row dynamically
  addNewTemplateValues(type, index?) {
    if (type === 'add') {
      this.resultListObj.groupSetting.conditions.push({ fieldValue: '', templateType: '', templateId: '' })
    }
    else if (type === 'delete') {
      this.resultListObj.groupSetting.conditions.splice(index, 1);
      this.updateSettings('', 'delete');
    }
  }
  //result group configuration popup
  overwriteConfiguration() {
    const modalData: any = {
      newTitle: 'Existing result group configurations will be overwritten with the field you chose.',
      body: 'Are you sure you want to continue ?',
      buttons: [{ key: 'yes', label: 'Continue', type: 'danger' }, { key: 'no', label: 'Cancel' }],
      confirmationPopUp: true
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup-result',
      data: modalData,
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.updateSettings(dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }
  //update settings
  updateSettings(dialogRef?, type?) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      settingsId: this.settingsId,
      indexPipelineId: this.indexPipelineId
    };
    this.resultListObj.resultsLimit = 20;
    if (dialogRef) {
      this.resultListObj.groupSetting.conditions = [];
    }
    this.service.invoke('update.settings', quaryparms, this.resultListObj).subscribe((res: any) => {
      if (res) {
        this.notificationService.notify(`Result setting ${type === 'delete' ? 'deleted' : 'saved'} successfully`, 'success');
        if (dialogRef) {
          dialogRef.close();
          this.closeCustomModal();
          this.getAllSettings(this.selectedTab, 'emptycondition');
        }
      }
    }, errRes => {
      this.errorToaster(errRes, 'Failed to update settings');
    });
  }
  //update template
  updateTemplate() {
    this.submitted = true;
    let checkTitle: boolean = true;
    if (this.templateDataBind.layout.renderTitle) {
      checkTitle = (this.templateDataBind.layout.title.length > 0) ? true : false;
    }
    //let validateText = this.validateFieldValues();
    if (this.validateTemplate() && checkTitle) {
      const quaryparms: any = {
        searchIndexId: this.serachIndexId,
        templateId: this.templateDataBind._id,
        indexPipelineId: this.indexPipelineId
      };
      if (this.templateDataBind.layout.renderTitle === false) {
        this.templateDataBind.layout.title = '';
      }
      if (this.templateDataBind.layout.behaviour === 'postback') {
        this.templateDataBind.layout.postbackUrl = this.postback;
        this.templateDataBind.mapping.url = '';
      }
      else if (this.templateDataBind.layout.behaviour === 'webpage') {
        this.templateDataBind.layout.postbackUrl = '';
      }
      this.service.invoke('update.template', quaryparms, this.templateDataBind).subscribe((res: any) => {
        if (res) {
          this.closeTemplateModal();
          this.submitted = false;
          this.notificationService.notify('Template updated successfully', 'success');
        }
      }, errRes => {
        this.errorToaster(errRes, 'Failed to update template');
      });
    }
    else {
      this.notificationService.notify('Enter the required fields to proceed', 'error');
    }
  }

  
  //validate template fields
  validateTemplate() {
    if (this.templateDataBind.layout.layoutType === 'l1') {
      this.templateDataBind.mapping.description = '';
      this.templateDataBind.mapping.img = '';
      return this.preview_title.length ? true : false;
    }
    else if (this.templateDataBind.layout.layoutType === 'l2') {
      this.templateDataBind.mapping.heading = '';
      this.templateDataBind.mapping.img = '';
      return this.preview_desc.length ? true : false;
    }
    else if (this.templateDataBind.layout.layoutType === 'l3') {
      this.templateDataBind.mapping.img = '';
      return (this.preview_title.length && this.preview_desc.length) ? true : false;
    }
    else if (this.templateDataBind.layout.layoutType === 'l5') {
      this.templateDataBind.mapping.heading = '';
      this.templateDataBind.mapping.description = '';
      return (this.preview_img.length) ? true : false;
    }
    else if (['l4', 'l6', 'l7', 'l9'].includes(this.templateDataBind.layout.layoutType)) {
      return (this.preview_title.length && this.preview_desc.length && this.preview_img.length) ? true : false;
    }
    else if (this.templateDataBind.layout.layoutType === 'l8') {
      this.templateDataBind.mapping.heading = '';
      return (this.preview_desc.length && this.preview_img.length) ? true : false;
    }
  }

  // validateFieldValues() {
  //   let hasFalseKeys = true;
  //   this.templateFieldValidateObj = {
  //     heading: true,
  //     description: true,
  //     image: true,
  //     url: true
  //   }
  //   if (this.allFieldData) {
  //     this.allFieldData.forEach(element => {
  //       if (element._id == this.templateDataBind.mapping.heading) {
  //         if (element.fieldName != this.preview_title) {
  //           this.notificationService.notify('Heading field is not matching,Please select the option to proceed', 'error');
  //           this.templateFieldValidateObj.heading = false;
  //         }
  //       } else if (element._id == this.templateDataBind.mapping.description) {
  //         if (element.fieldName != this.preview_desc) {
  //           this.notificationService.notify('Description field is not matching,Please select the option to proceed', 'error');
  //           this.templateFieldValidateObj.description = false;
  //         }
  //       }
  //       else if (element._id == this.templateDataBind.mapping.img) {
  //         if (element.fieldName != this.preview_img) {
  //           this.notificationService.notify('Image field is not matching,Please select the option to proceed', 'error');
  //           this.templateFieldValidateObj.image = false;
  //         }
  //       }
  //       else if (element._id == this.templateDataBind.mapping.url) {
  //         if (element.fieldName != this.preview_url) {
  //           this.notificationService.notify('Url field is not matching,Please select the option to proceed', 'error');
  //           this.templateFieldValidateObj.url = false;
  //         }
  //       }
  //       else if (element.fieldName == this.preview_desc) {
  //         if (element._id != this.templateDataBind.mapping.description) {
  //           this.notificationService.notify('Description field is not matching,Please select the option to proceed', 'error');
  //           this.templateFieldValidateObj.description = false;
  //         }
  //       }
  //       else if (element.fieldName == this.preview_title) {
  //         if (element._id != this.templateDataBind.mapping.heading) {
  //           this.notificationService.notify('Heading field is not matching,Please select the option to proceed', 'error');
  //           this.templateFieldValidateObj.heading = false;
  //         }
  //       }
  //       else if (element.fieldName == this.preview_img) {
  //         if (element._id != this.templateDataBind.mapping.img) {
  //           this.notificationService.notify('Image field is not matching,Please select the option to proceed', 'error');
  //           this.templateFieldValidateObj.image = false;
  //         }
  //       }
  //       else if (element.fieldName == this.preview_url) {
  //         if (element._id != this.templateDataBind.mapping.url) {
  //           this.notificationService.notify('Url field is not matching,Please select the option to proceed', 'error');
  //           this.templateFieldValidateObj.url = false;
  //         }
  //       }
  //     });
  //     hasFalseKeys = Object.keys(this.templateFieldValidateObj).some(k => !this.templateFieldValidateObj[k]);
  //     if (hasFalseKeys) {
  //       return true
  //     } else {
  //       return false
  //     }
  //   } else {
  //     return false
  //   }
  // }
  //copy configuration method
  copyConfiguration(type, tab?) {
    this.copyConfigObj.message = '';
    this.tabData = this.tabList.filter(item => item.id === tab);
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
        const date = moment(res.copiedOn).format('dddd, MMMM Do YYYY, h:mm:ss a');
        this.copyConfigObj.message = `Configurations applied from ${this.tabData[0].name} | ${date}.`;
        this.notificationService.notify(' Result copied successfully', 'success');
        this.getAllSettings(this.selectedTab);
      }, errRes => {
        this.copyConfigObj.loader = false;
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

  clearcontent(){
      
    if($('#searchBoxId') && $('#searchBoxId').length){
    $('#searchBoxId')[0].value = "";
    this.field_name='';
  }
  }
}
  

