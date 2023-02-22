import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { filter, Subscription, tap, withLatestFrom } from 'rxjs';
import { ConfirmationDialogComponent } from '../../helpers/components/confirmation-dialog/confirmation-dialog.component';
import { format } from 'date-fns';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { SideBarService } from '@kore.apps/services/header.service';
import { InlineManualService } from '@kore.apps/services/inline-manual.service';
import { NotificationService } from '@kore.apps/services/notification.service';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { LocalStoreService } from '@kore.apps/services/localstore.service';
import { Store } from '@ngrx/store';

import {
  selectAppIds,
  selectIndexPipelineId,
  selectSearchExperiance,
  selectSearchIndexId,
} from '@kore.apps/store/app.selectors';
declare const $: any;
@Component({
  selector: 'app-result-templates',
  templateUrl: './result-templates.component.html',
  styleUrls: ['./result-templates.component.scss'],
})
export class ResultTemplatesComponent implements OnInit, OnDestroy {
  customModalRef: any;
  templateModalRef: any;
  field_name: string;
  copyConfigObj: any = { loader: false, message: '' };
  serachIndexId: any;
  indexPipelineId: any;
  queryPipelineId: any;
  allPresetableFieldData: any;
  allFieldData: any;
  preview_title: any = '';
  preview_desc: any = '';
  preview_desc1: any = '';
  preview_label1: any = '';
  preview_label2: any = '';
  preview_rateFiled: any = '';
  preview_StrikedrateFiled: any = '';
  preview_img: any = '';
  preview_url: any = '';
  preview_icon: any = '';
  preview_rating: any = '';
  preview_textField1: any = '';
  preview_textField2: any = '';
  preview_chips: any = '';
  groupname: any = '';
  templateDataBind: any = {
    layout: {
      behaviour: 'webpage',
      isClickable: true,
      layoutType: 'l1',
      listType: 'classic',
      renderTitle: true,
      textAlignment: 'left',
      title: 'Web Pages',
    },
    mapping: {
      description: '',
      description1: '',
      label1: '',
      label2: '',
      rateField: '',
      strikedOffRate: '',
      heading: '',
      img: '',
      url: '',
      searchIndexId: '',
      icon: '',
      textField1: '',
      textField2: '',
      chips: '',
      rating: '',
    },
    type: '',
  };
  templateFieldValidateObj = {
    heading: true,
    description: true,
    description1: true,
    label1: true,
    label2: true,
    rateField: true,
    strikedOffRate: true,
    image: true,
    url: true,
    icon: true,
    textField1: true,
    textField2: true,
    chips: true,
    rating: true,
  };
  customtemplateBtndisable = false;
  heading_fieldData: any;
  desc_fieldData: any;
  desc_fieldData1: any;
  label1_fieldData: any;
  label2_fieldData: any;
  rate_fieldData: any;
  Strikedrate_fieldData: any;
  img_fieldData: any;
  url_fieldData: any;
  icon_fieldData: any;
  textField1_fieldData: any;
  textField2_fieldData: any;
  chips_fieldData: any;
  rating_fieldData: any;
  fieldData: any;
  templateData: any;
  subscription: Subscription;
  searchConfigurationSubscription: Subscription;
  searchExperienceConfig: any = {};
  searchTemplatesDisabled = false;
  fieldPopupType: string;
  fieldPopup = false;
  submitted = false;
  selectedTab = 'fullSearch';
  selectedTemplateName: string;
  postback = '';
  tabList: any = [
    { id: 'liveSearch', name: 'resultTemplate_liveSearch' },
    { id: 'conversationalSearch', name: 'resultTemplate_conversationalSearch' },
    { id: 'fullSearch', name: 'resultTemplate_fullPageResult' },
  ];
  resultListObj: any = {
    facetsSetting: {
      aligned: 'left',
      enabled: true,
    },
    groupResults: false,
    groupSetting: {
      fieldId: '',
      fieldName: '',
      conditions: [],
    },
  };
  fieldValues: any;
  settingsId: string;
  selectedGroupName: string;
  defaultFieldName: string;
  tabData: any;
  templateNames: any = ['list', 'carousel', 'grid'];
  streamId;
  searchIndexId;
  filterFacets: any = [
    { name: 'Left Aligned', type: 'left' },
    { name: 'Right Aligned', type: 'right' },
    { name: 'Top Aligned', type: 'top' },
  ];
  @ViewChild('customModal') customModal: KRModalComponent;
  @ViewChild('templateModal') templateModal: KRModalComponent;

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private appSelectionService: AppSelectionService,
    public dialog: MatDialog,
    public headerService: SideBarService,
    public inlineManual: InlineManualService,
    public localstore: LocalStoreService,
    private store: Store
  ) {}

  ngOnInit(): void {
    //Initializing Id's
    this.initAppIds();
    this.getSearchExperience();
    this.updateResultTemplateTabsAccess();
  }

  initAppIds() {
    const idsSub = this.store
      .select(selectAppIds)
      .subscribe(
        ({ streamId, searchIndexId, indexPipelineId, queryPipelineId }) => {
          this.streamId = streamId;
          this.searchIndexId = searchIndexId;
          this.indexPipelineId = indexPipelineId;
          this.queryPipelineId = queryPipelineId;
        }
      );

    const indexPipelineSub = this.store
      .select(selectIndexPipelineId)
      .pipe(
        withLatestFrom(this.store.select(selectSearchIndexId)),
        tap(([indexPipelineId, searchIndexId]) => {
          this.searchIndexId = searchIndexId;
          this.indexPipelineId = indexPipelineId;
          this.loadFiledsData();
        })
      )
      .subscribe();

    this.subscription?.add(idsSub);
    this.subscription?.add(indexPipelineSub);
  }

  //get default data
  getSearchExperience() {
    const searchExperianceConfigSub = this.store
      .select(selectSearchExperiance)
      .pipe(filter((res) => !!res))
      .subscribe((res) => {
        this.searchExperienceConfig = res;
        // this.loadFiledsData();
        this.updateResultTemplateTabsAccess();
      });

    this.subscription?.add(searchExperianceConfigSub);
  }

  loadFiledsData() {
    if (this.indexPipelineId) {
      this.getFieldAutoComplete('all');
      this.getFieldAutoComplete('presentable');
      // this.getAllSettings(this.selectedTab)
    }
  }

  //selected tab method
  tabSelection(id) {
    this.getAllSettings(id);
    this.selectedTab = id;
  }
  /** Fields Data for options  */
  getFieldAutoComplete(type) {
    /** url & QuerryParam for Presentable Fields */
    let url = '';
    let quaryparms;
    if (type == 'all') {
      url = 'get.getFieldAutocomplete';
      const query: any = '';
      quaryparms = {
        searchIndexID: this.searchIndexId,
        indexPipelineId: this.indexPipelineId,
        query,
      };
    } /** url & QuerryParam for Presentable Fields */ else if (
      type == 'presentable'
    ) {
      url = 'get.presentableFields';
      quaryparms = {
        isSelected: true,
        sortField: 'fieldName',
        orderType: 'asc', //desc,
        indexPipelineId: this.indexPipelineId,
        streamId: this.streamId,
        queryPipelineId: this.queryPipelineId,
        searchKey: '',
      };
    }
    this.service.invoke(url, quaryparms).subscribe(
      (res) => {
        if (type == 'all') {
          // this.heading_fieldData = [...res];
          // this.desc_fieldData = [...res];
          // this.desc_fieldData1 = [...res];
          // this.label1_fieldData = [...res];
          // this.label2_fieldData = [...res];
          // this.rate_fieldData = [...res];
          // this.Strikedrate_fieldData = [...res];
          // this.img_fieldData = [...res];
          // this.url_fieldData = [...res];
          this.icon_fieldData = [...res];
          // this.textField1_fieldData = [...res];
          // this.textField2_fieldData = [...res];
          // this.chips_fieldData = [...res];
          // this.rating_fieldData = [...res];
          // this.fieldData = [...res];
          this.allFieldData = res;
        } else if (type == 'presentable') {
          this.heading_fieldData = [...res.data];
          this.desc_fieldData = [...res.data];
          this.desc_fieldData1 = [...res.data];
          this.label1_fieldData = [...res.data];
          this.label2_fieldData = [...res.data];
          this.rate_fieldData = [...res.data];
          this.Strikedrate_fieldData = [...res.data];
          this.img_fieldData = [...res.data];
          this.url_fieldData = [...res.data];
          //this.icon_fieldData = [...res.data];
          this.textField1_fieldData = [...res.data];
          this.textField2_fieldData = [...res.data];
          this.chips_fieldData = [...res.data];
          this.rating_fieldData = [...res.data];
          this.fieldData = [...res.data];
          this.allPresetableFieldData = res.data;
        }
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to get fields');
      }
    );
  }
  /** Field Selection */
  filedSelect(type, field) {
    if (type == 'heading') {
      this.templateDataBind.mapping.heading = field._id;
      this.preview_title = field.fieldName;
      this.heading_fieldData = [...this.allPresetableFieldData];
      this.templateFieldValidateObj.heading = true;
    } else if (type == 'description') {
      this.templateDataBind.mapping.description = field._id;
      this.preview_desc = field.fieldName;
      this.desc_fieldData = [...this.allPresetableFieldData];
      this.templateFieldValidateObj.description = true;
    } else if (type == 'description1') {
      this.templateDataBind.mapping.description1 = field._id;
      this.preview_desc1 = field.fieldName;
      this.desc_fieldData1 = [...this.allPresetableFieldData];
      this.templateFieldValidateObj.description1 = true;
    } else if (type == 'label1') {
      this.templateDataBind.mapping.label1 = field._id;
      this.preview_label1 = field.fieldName;
      this.label1_fieldData = [...this.allPresetableFieldData];
      this.templateFieldValidateObj.label1 = true;
    } else if (type == 'label2') {
      this.templateDataBind.mapping.label2 = field._id;
      this.preview_label2 = field.fieldName;
      this.label2_fieldData = [...this.allPresetableFieldData];
      this.templateFieldValidateObj.label2 = true;
    } else if (type == 'rateField') {
      this.templateDataBind.mapping.rateField = field._id;
      this.preview_rateFiled = field.fieldName;
      this.rate_fieldData = [...this.allPresetableFieldData];
      this.templateFieldValidateObj.rateField = true;
    } else if (type == 'strikedOffRate') {
      this.templateDataBind.mapping.strikedOffRate = field._id;
      this.preview_StrikedrateFiled = field.fieldName;
      this.Strikedrate_fieldData = [...this.allPresetableFieldData];
      this.templateFieldValidateObj.strikedOffRate = true;
    } else if (type == 'rating') {
      this.templateDataBind.mapping.rating = field._id;
      this.preview_rating = field.fieldName;
      this.rating_fieldData = [...this.allPresetableFieldData];
      this.templateFieldValidateObj.rating = true;
    } else if (type == 'image') {
      this.templateDataBind.mapping.img = field._id;
      this.preview_img = field.fieldName;
      this.img_fieldData = [...this.allPresetableFieldData];
      this.templateFieldValidateObj.image = true;
    } else if (type == 'url') {
      this.templateDataBind.mapping.url = field._id;
      this.preview_url = field.fieldName;
      this.url_fieldData = [...this.allPresetableFieldData];
      this.templateFieldValidateObj.url = true;
    } else if (type == 'icon') {
      this.templateDataBind.mapping.icon = field._id;
      this.preview_icon = field.fieldName;
      this.icon_fieldData = [...this.allFieldData];
      this.templateFieldValidateObj.icon = true;
    } else if (type == 'textField1') {
      this.templateDataBind.mapping.textField1 = field._id;
      this.preview_textField1 = field.fieldName;
      this.textField1_fieldData = [...this.allPresetableFieldData];
      this.templateFieldValidateObj.textField1 = true;
    } else if (type == 'textField2') {
      this.templateDataBind.mapping.textField2 = field._id;
      this.preview_textField2 = field.fieldName;
      this.textField2_fieldData = [...this.allPresetableFieldData];
      this.templateFieldValidateObj.textField2 = true;
    } else if (type == 'chips') {
      this.templateDataBind.mapping.chips = field._id;
      this.preview_chips = field.fieldName;
      this.chips_fieldData = [...this.allPresetableFieldData];
      this.templateFieldValidateObj.chips = true;
    }
  }
  searchlist(type, valToSearch, filedData) {
    const data = [];
    filedData.filter((element) => {
      const filedNamelower = element.fieldName.toLocaleLowerCase();
      const valToSearchlower = valToSearch.toLocaleLowerCase();
      if (filedNamelower.includes(valToSearchlower)) {
        data.push(element);
      }
    });
    // filedData.filter(element => {
    //   if (element.fieldName.includes(valToSearch)) {
    //     data.push(element)
    //   }
    // });
    if (valToSearch) {
      if (type == 'heading') {
        this.heading_fieldData = [...data];
      } else if (type == 'description') {
        this.desc_fieldData = [...data];
      } else if (type == 'description1') {
        this.desc_fieldData1 = [...data];
      } else if (type == 'label1') {
        this.label1_fieldData = [...data];
      } else if (type == 'label2') {
        this.label2_fieldData = [...data];
      } else if (type == 'rateField') {
        this.rate_fieldData = [...data];
      } else if (type == 'strikedOffRate') {
        this.Strikedrate_fieldData = [...data];
      } else if (type == 'image') {
        this.img_fieldData = [...data];
      } else if (type == 'url') {
        this.url_fieldData = [...data];
      } else if (type == 'icon') {
        this.icon_fieldData = [...data];
      } else if (type == 'textField1') {
        this.textField1_fieldData = [...data];
      } else if (type == 'textField2') {
        this.textField2_fieldData = [...data];
      } else if (type == 'chips') {
        this.chips_fieldData = [...data];
      } else if (type == 'rating') {
        this.rating_fieldData = [...data];
      }
    } else {
      if (type == 'heading') {
        this.heading_fieldData = [...filedData];
      } else if (type == 'description1') {
        this.desc_fieldData1 = [...filedData];
      } else if (type == 'label1') {
        this.label1_fieldData = [...filedData];
      } else if (type == 'label2') {
        this.label2_fieldData = [...filedData];
      } else if (type == 'rateField') {
        this.rate_fieldData = [...filedData];
      } else if (type == 'strikedOffRate') {
        this.Strikedrate_fieldData = [...filedData];
      } else if (type == 'description') {
        this.desc_fieldData = [...filedData];
      } else if (type == 'image') {
        this.img_fieldData = [...filedData];
      } else if (type == 'url') {
        this.url_fieldData = [...filedData];
      } else if (type == 'icon') {
        this.icon_fieldData = [...filedData];
      } else if (type == 'textField1') {
        this.textField1_fieldData = [...filedData];
      } else if (type == 'textField2') {
        this.textField2_fieldData = [...filedData];
      } else if (type == 'chips') {
        this.chips_fieldData = [...filedData];
      } else if (type == 'rating') {
        this.rating_fieldData = [...filedData];
      }
    }
  }
  /** Chat SDK approach and by-default Data */
  updateResultTemplateTabsAccess() {
    // console.log("searchExperienceConfig", this.searchExperienceConfig)
    if (
      this.searchExperienceConfig &&
      Object.values(this.searchExperienceConfig).length
    ) {
      if (
        this.searchExperienceConfig &&
        this.searchExperienceConfig.experienceConfig &&
        this.searchExperienceConfig.experienceConfig.searchBarPosition
      ) {
        this.searchTemplatesDisabled =
          this.searchExperienceConfig.experienceConfig.searchBarPosition ===
          'top'
            ? true
            : false;
        this.getAllSettings(this.selectedTab);
        if (this.searchTemplatesDisabled) {
          this.filterFacets = this.filterFacets.filter(
            (res) => res.type !== 'right'
          );
        }
      }
    } else {
      this.searchTemplatesDisabled = false;
    }
  }
  /** Call for All Setting Templates */
  getAllSettings(setting, type?) {
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
      interface: setting,
    };
    this.service.invoke('get.settingsByInterface', quaryparms).subscribe(
      (res) => {
        this.resultListObj = res;
        this.defaultFieldName = this.resultListObj.groupSetting.fieldName;
        this.settingsId = res._id;
        const obj = {
          _id: this.resultListObj.groupSetting.fieldId,
          fieldName: this.resultListObj.groupSetting.fieldName,
        };
        this.getFieldValues(obj);
        if (type === 'emptycondition') {
          this.addNewTemplateValues('add');
        }
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to fetch all Setting Informations');
      }
    );
    //get.settingsById
    // update.settings
    // copy.settings
    // new.template
    // get.templateById
    // update.template
  }
  getTemplate(templateData, type) {
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      templateId: templateData.templateId,
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
    };
    this.service.invoke('get.templateById', quaryparms).subscribe(
      (res: any) => {
        this.templateDataBind = res;
        if (type === 'modal') {
          this.fieldsDisplay(res.mapping);
          this.openTemplateModal();
          this.templateTypeSelection(res.layout.layoutType);
          if (this.templateDataBind.layout.behaviour === 'postback') {
            this.postback = this.templateDataBind.layout.postbackUrl;
          }
        }
        this.customtemplateBtndisable = false;
      },
      (errRes) => {
        this.customtemplateBtndisable = false;
        this.errorToaster(errRes, 'Failed to fetch Template');
      }
    );
  }

  fieldsDisplay(mapping) {
    for (const property in mapping) {
      this.fieldData.forEach((element) => {
        if (
          `${property}` == 'heading' &&
          element._id == `${mapping[property]}`
        ) {
          this.preview_title = element.fieldName;
        } else if (
          `${property}` == 'description' &&
          element._id == `${mapping[property]}`
        ) {
          this.preview_desc = element.fieldName;
        } else if (
          `${property}` == 'description1' &&
          element._id == `${mapping[property]}`
        ) {
          this.preview_desc1 = element.fieldName;
        } else if (
          `${property}` == 'label1' &&
          element._id == `${mapping[property]}`
        ) {
          this.preview_label1 = element.fieldName;
        } else if (
          `${property}` == 'label2' &&
          element._id == `${mapping[property]}`
        ) {
          this.preview_label2 = element.fieldName;
        } else if (
          `${property}` == 'rateField' &&
          element._id == `${mapping[property]}`
        ) {
          this.preview_rateFiled = element.fieldName;
        } else if (
          `${property}` == 'strikedOffRate' &&
          element._id == `${mapping[property]}`
        ) {
          this.preview_StrikedrateFiled = element.fieldName;
        } else if (
          `${property}` == 'img' &&
          element._id == `${mapping[property]}`
        ) {
          this.preview_img = element.fieldName;
        } else if (
          `${property}` == 'url' &&
          element._id == `${mapping[property]}`
        ) {
          this.preview_url = element.fieldName;
        } else if (
          `${property}` == 'icon' &&
          element._id == `${mapping[property]}`
        ) {
          this.preview_icon = element.fieldName;
        } else if (
          `${property}` == 'chips' &&
          element._id == `${mapping[property]}`
        ) {
          this.preview_chips = element.fieldName;
        } else if (
          `${property}` == 'textField1' &&
          element._id == `${mapping[property]}`
        ) {
          this.preview_textField1 = element.fieldName;
        } else if (
          `${property}` == 'textField2' &&
          element._id == `${mapping[property]}`
        ) {
          this.preview_textField2 = element.fieldName;
        } else if (
          `${property}` == 'rating' &&
          element._id == `${mapping[property]}`
        ) {
          this.preview_rating = element.fieldName;
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
    this.templateDataBind.layout.renderTitle =
      !this.templateDataBind.layout.renderTitle;
  }
  clickableChange() {
    this.templateDataBind.layout.isClickable =
      !this.templateDataBind.layout.isClickable;
    this.templateDataBind.layout.behaviour = 'webpage';
  }
  clickBehaviorChange(behaviour) {
    this.templateDataBind.layout.behaviour = behaviour;
  }
  //Open Template Modal
  openTemplateConatiner(templateData, type, groupname?) {
    const templateName = this.tabList.filter(
      (data) => data.id == this.selectedTab
    );
    this.selectedTemplateName = templateName[0].name;
    this.selectedGroupName = templateData?.templateId
      ? templateData?.fieldValue
      : templateData?.defaultTemplateType;
    this.customtemplateBtndisable = true;
    if (groupname == 'Default') {
      this.selectedGroupName = groupname;
    }
    if (templateData?.templateId) {
      this.getTemplate(templateData, type);
    } else {
      this.getTemplate(
        { templateId: this.resultListObj.defaultTemplateId },
        type
      );
    }
    this.preview_title = '';
    this.preview_desc = '';
    this.preview_desc1 = '';
    this.preview_label1 = '';
    this.preview_label2 = '';
    this.preview_rateFiled = '';
    this.preview_StrikedrateFiled = '';
    this.preview_img = '';
    this.preview_url = '';
    this.preview_icon = '';
    this.preview_chips = '';
    this.preview_textField1 = '';
    this.preview_textField2 = '';
    this.preview_rating = '';
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
      } else if (this.fieldPopupType === 'edit') {
        this.resultListObj.groupSetting.fieldName = this.defaultFieldName;
        this.getAllSettings(this.selectedTab);
      }
    }
  }
  //get all templates
  // getAllTemplates() {
  //   const quaryparms: any = {
  //     searchIndexId: this.searchIndexId,
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
      sidx: this.searchIndexId,
      indexPipelineId: this.indexPipelineId,
      fieldId: field._id,
    };
    this.service.invoke('get.facetValues', quaryparms).subscribe(
      (res) => {
        this.fieldValues = res.values;
        // if (res.values.length) {
        //   res.values.forEach(ele => {
        //     const obj = { fieldValue: ele, templateId: '' }
        //     this.resultListObj.groupSetting.conditions.push(obj);
        //   })
        // }
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to get field values');
      }
    );
  }
  errorToaster(errRes, message) {
    if (
      errRes &&
      errRes.error &&
      errRes.error.errors &&
      errRes.error.errors.length &&
      errRes.error.errors[0].msg
    ) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
  //new result template based on template type
  getTemplateData(type, index?, value?) {
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
    };
    const payload = { type: type };
    this.service.invoke('post.templates', quaryparms, payload).subscribe(
      (res) => {
        if (index === 'default') {
          this.resultListObj.defaultTemplateType = type;
          this.resultListObj.defaultTemplateId = res._id;
        } else {
          this.resultListObj.groupSetting.conditions[index].templateId =
            res._id;
        }
        this.updateSettings();
        this.openTemplateConatiner(value, 'modal');
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to get field values');
      }
    );
  }
  //add new templates values row dynamically
  addNewTemplateValues(type, index?) {
    if (type === 'add') {
      this.resultListObj.groupSetting.conditions.push({
        fieldValue: '',
        templateType: '',
        templateId: '',
      });
    } else if (type === 'delete') {
      this.resultListObj.groupSetting.conditions.splice(index, 1);
      this.updateSettings('', 'delete');
    }
  }
  //result group configuration popup
  overwriteConfiguration() {
    const modalData: any = {
      newTitle:
        'Existing result group configurations will be overwritten with the field you chose.',
      body: 'Are you sure you want to continue ?',
      buttons: [
        { key: 'yes', label: 'Continue', type: 'danger' },
        { key: 'no', label: 'Cancel' },
      ],
      confirmationPopUp: true,
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup-result',
      data: modalData,
    });
    dialogRef.componentInstance.onSelect.subscribe((result) => {
      if (result === 'yes') {
        this.updateSettings(dialogRef);
      } else if (result === 'no') {
        dialogRef.close();
      }
    });
  }
  //scroll to preview
  scrollPreview() {
    const element = document.getElementById('imgScroll');
    setTimeout(() => {
      if (element) {
        element.scrollIntoView();
      }
    }, 500);
  }
  //update settings
  updateSettings(dialogRef?, type?) {
    const quaryparms: any = {
      searchIndexId: this.searchIndexId,
      settingsId: this.settingsId,
      indexPipelineId: this.indexPipelineId,
      queryPipelineId: this.queryPipelineId,
    };
    this.resultListObj.resultsLimit = 20;
    if (dialogRef) {
      this.resultListObj.groupSetting.conditions = [];
    }
    this.service
      .invoke('update.settings', quaryparms, this.resultListObj)
      .subscribe(
        (res: any) => {
          // this.scrollPreview();
          if (res) {
            this.notificationService.notify(
              `Result setting ${
                type === 'delete' ? 'deleted' : 'saved'
              } successfully`,
              'success'
            );
            if (dialogRef) {
              dialogRef.close();
              this.closeCustomModal();
              this.getAllSettings(this.selectedTab, 'emptycondition');
            }
          }
        },
        (errRes) => {
          this.errorToaster(errRes, 'Failed to update settings');
        }
      );
  }
  //update template
  updateTemplate() {
    this.submitted = true;
    let checkTitle = true;
    if (this.templateDataBind.layout.renderTitle) {
      checkTitle =
        this.templateDataBind.layout?.title?.length > 0 ? true : false;
    }
    //let validateText = this.validateFieldValues();
    if (this.validateTemplate() && checkTitle) {
      const quaryparms: any = {
        searchIndexId: this.searchIndexId,
        templateId: this.templateDataBind._id,
        indexPipelineId: this.indexPipelineId,
        queryPipelineId: this.queryPipelineId,
      };
      if (this.templateDataBind.layout.renderTitle === false) {
        this.templateDataBind.layout.title = '';
      }
      if (this.templateDataBind.layout.behaviour === 'postback') {
        this.templateDataBind.layout.postbackUrl = this.postback;
        this.templateDataBind.mapping.url = '';
      } else if (this.templateDataBind.layout.behaviour === 'webpage') {
        this.templateDataBind.layout.postbackUrl = '';
      }
      this.service
        .invoke('update.template', quaryparms, this.templateDataBind)
        .subscribe(
          (res: any) => {
            if (res) {
              this.closeTemplateModal();
              this.submitted = false;
              this.notificationService.notify(
                'Template updated successfully',
                'success'
              );
            }
          },
          (errRes) => {
            this.errorToaster(errRes, 'Failed to update template');
          }
        );
    } else {
      this.notificationService.notify(
        'Enter the required fields to proceed',
        'error'
      );
    }
  }

  //validate template fields
  validateTemplate() {
    if (this.templateDataBind.layout.layoutType === 'l1') {
      this.templateDataBind.mapping.description = '';
      this.templateDataBind.mapping.img = '';
      return this.preview_title.length ? true : false;
    } else if (this.templateDataBind.layout.layoutType === 'l2') {
      this.templateDataBind.mapping.heading = '';
      this.templateDataBind.mapping.img = '';
      return this.preview_desc.length ? true : false;
    } else if (
      this.templateDataBind.layout.layoutType === 'l3' ||
      this.templateDataBind.layout.layoutType === 'l10' ||
      this.templateDataBind.layout.layoutType === 'l11'
    ) {
      this.templateDataBind.mapping.img = '';
      return this.preview_title.length && this.preview_desc.length
        ? true
        : false;
    } else if (this.templateDataBind.layout.layoutType === 'l5') {
      this.templateDataBind.mapping.heading = '';
      this.templateDataBind.mapping.description = '';
      return this.preview_img.length ? true : false;
    } else if (
      ['l4', 'l6', 'l7', 'l9'].includes(this.templateDataBind.layout.layoutType)
    ) {
      return this.preview_title.length &&
        this.preview_desc.length &&
        this.preview_img.length
        ? true
        : false;
    } else if (this.templateDataBind.layout.layoutType === 'l8') {
      this.templateDataBind.mapping.heading = '';
      return this.preview_desc.length && this.preview_img.length ? true : false;
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
    this.tabData = this.tabList.filter((item) => item.id === tab);
    if (type === 'open') {
      this.copyConfigObj.loader = true;
      const quaryparms: any = {
        searchIndexId: this.searchIndexId,
        indexPipelineId: this.indexPipelineId,
        queryPipelineId: this.queryPipelineId,
        settingsId: this.resultListObj._id,
        fromInterface: tab,
      };
      const payload = this.resultListObj;
      this.service.invoke('copy.settings', quaryparms, payload).subscribe(
        (res) => {
          this.copyConfigObj.loader = false;
          const format_date = new Date(res.copiedOn);
          const date = format(format_date, 'eeee , MMMM do yyyy, h:mm:ss aaa');
          this.copyConfigObj.message = `Configurations applied from ${this.tabData[0].name} | ${date}.`;
          this.notificationService.notify(
            ' Result copied successfully',
            'success'
          );
          this.getAllSettings(this.selectedTab);
        },
        (errRes) => {
          this.copyConfigObj.loader = false;
          this.errorToaster(errRes, 'Failed to get field values');
        }
      );
    } else if (type === 'close') {
      this.copyConfigObj = { loader: false, message: '' };
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.searchConfigurationSubscription
      ? this.searchConfigurationSubscription.unsubscribe()
      : false;
  }

  clearcontent() {
    if ($('#searchBoxId') && $('#searchBoxId').length) {
      $('#searchBoxId')[0].value = '';
      this.searchlist('heading', '', this.fieldData);
      this.field_name = '';
    }
  }
  // clear content for desc
  clearcontentdesc() {
    if ($('#searchBoxId1') && $('#searchBoxId1').length) {
      $('#searchBoxId1')[0].value = '';
      this.searchlist('description', '', this.fieldData);
      this.field_name = '';
    }
  }
  clearcontentdesc1() {
    if ($('#searchBoxIdDec') && $('#searchBoxIdDec').length) {
      $('#searchBoxIdDec')[0].value = '';
      this.searchlist('description1', '', this.fieldData);
      this.field_name = '';
    }
  }
  clearcontentLabel1() {
    if ($('#searchBoxIdLabel1') && $('#searchBoxIdLabel1').length) {
      $('#searchBoxIdLabel1')[0].value = '';
      this.searchlist('label1', '', this.fieldData);
      this.field_name = '';
    }
  }
  clearcontentLabel2() {
    if ($('#searchBoxIdLabel2') && $('#searchBoxIdLabel2').length) {
      $('#searchBoxIdLabel2')[0].value = '';
      this.searchlist('label2', '', this.fieldData);
      this.field_name = '';
    }
  }
  clearcontentRateField() {
    if ($('#searchBoxIdRateField') && $('#searchBoxIdRateField').length) {
      $('#searchBoxIdRateField')[0].value = '';
      this.searchlist('rateField', '', this.fieldData);
      this.field_name = '';
    }
  }
  clearcontentStrikedRateField() {
    if (
      $('#searchBoxIdStrikedRateField') &&
      $('#searchBoxIdStrikedRateField').length
    ) {
      $('#searchBoxIdStrikedRateField')[0].value = '';
      this.searchlist('strikedOffRate', '', this.fieldData);
      this.field_name = '';
    }
  }

  // clear content for image
  clearcontentimage() {
    if ($('#searchBoxId2') && $('#searchBoxId2').length) {
      $('#searchBoxId2')[0].value = '';
      this.searchlist('image', '', this.fieldData);
      this.field_name = '';
    }
  }

  // clear content for URL
  clearcontenturl() {
    if ($('#searchBoxId3') && $('#searchBoxId3').length) {
      $('#searchBoxId3')[0].value = '';
      this.searchlist('url', '', this.fieldData);
      this.field_name = '';
    }
  }
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }
}
