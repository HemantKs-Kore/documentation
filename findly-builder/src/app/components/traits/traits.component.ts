import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { AuthService } from '@kore.services/auth.service';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import * as _ from 'underscore';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { of, interval, Subject, Subscription } from 'rxjs';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

declare const $: any;
@Component({
  selector: 'app-traits',
  templateUrl: './traits.component.html',
  styleUrls: ['./traits.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TraitsComponent implements OnInit {
  @ViewChild('statusModalPop') statusModalPop: KRModalComponent;
  @ViewChild('addUtteranceModalPop') addUtteranceModalPop: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;
  @ViewChild('perfectScroll2') perfectScroll2: PerfectScrollbarComponent;
  currentUtteranceIndex: number;
  currentTraitKey: string;
  newUtterance: any;
  tempUtterance: string;
  statusModalPopRef: any = [];
  addUtteranceModalPopRef: any = [];
  selcectionObj: any = {
    selectAll: false,
    selectedItems: [],
    selectedCount: 0
  };
  skip = 0;
  utteranceList = [];
  showUtteranceInput = false;
  showEditUtteranceInput: any;
  showEditTraitInput: any;
  traitsObj: any = [];
  traitType: string;
  traitsTableData: any = [];
  loaderFlag = false;
  emptyData = true;
  loadingTraits = true
  traitCounts;
  showSearch;
  searchImgSrc: any = 'assets/icons/search_gray.svg';
  activeClose = false;
  searchFocusIn = false;
  serachTraits: any = '';
  traits: any = {
    traitGroups: {},
    addEditTraits: {},
    selectedtrait: {}
  };
  allTraits: any = [];
  allTraitsNegations: any = [];
  selectedApp;
  serachIndexId;
  queryPipelineId;
  traitDeleted;
  defaultGroupConfigs: any = {
    matchStrategy: 'probability',
    scoreThreshold: 0.5,
    algo: 'n_gram',
    configuration: {
      skip_gram: {
        seqLength: 2,
        maxSkipDistance: 1
      },
      n_gram: {
        minVal: 1,
        maxVal: 1,
      }
    },
  };
  groupConfigs;
  selectedTraitKey;
  sliderMode;
  add: any = {
    traitName: ''
  };
  currentTraitEditIndex;
  editedContent;
  traitsCount = false;
  indexPipelineId;
  subscription: Subscription;
  totalRecord: number = 0;
  submitted = false;
  uttSubmitted = false;
  componentType: string = 'indexing';
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    public authService: AuthService,
    private appSelectionService: AppSelectionService
  ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.queryPipelineId = this.selectedApp.searchIndexes[0].queryPipelineId;
    this.groupConfigs = JSON.parse(JSON.stringify(this.defaultGroupConfigs));
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    this.loadFileds();
    this.subscription = this.appSelectionService.appSelectedConfigs.subscribe(res => {
      this.loadFileds();
    })


  }
  loadingTraits1: boolean;
  loadImageText: boolean = false;
  imageLoad() {
    this.loadingTraits = false;
    this.loadingTraits1 = true;
    this.loadImageText = true;
  }
  loadFileds() {
    this.indexPipelineId = this.workflowService.selectedIndexPipeline();
    if (this.indexPipelineId) {
      this.getTraitsGroupsApi(true);
    }
  }
  trainIndex() {
    $('#trainId').click();
  }
  getTraitsSliceValue(traits) {
    let sliceValue = 0;
    if (traits.length) {
      let columnWidth = document.getElementsByClassName('traits-groups')[0].clientWidth - 65;
      let traitsLength = 0;
      traits.forEach((t) => {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d");
        ctx.font = "400 14px Roboto";
        var width = ctx.measureText(t.traitName + ', ').width;
        traitsLength = width + traitsLength;
        if (columnWidth < traitsLength) {
          return sliceValue;
        } else {
          sliceValue = sliceValue + 1;
        }
      })
    }

    return sliceValue;
  }
  getTraitsGroupsApi(initial?) {
    if (initial) {
      this.loadingTraits = true;
    }
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      offset: this.skip || 0,
      limit:10
    }
    if(this.serachTraits === ''){
      quaryparms.search = this.serachTraits
    }
    this.service.invoke('get.traits', quaryparms).subscribe(res => {
      this.traits.traitGroups = res.traitGroups;
      this.totalRecord = res.totalCount || 0;
      // this.loadingTraits = false;
      const allTraitskeys: any = {};
      let tempTraitkey = '';
      const alltraitsArr: any = [];
      const allTraitsNegations: any = [];
      if (this.traits.traitGroups && this.traits.traitGroups.length) {
        $.each(this.traits.traitGroups, (i, traits) => {
          $.each(traits.traits, function (j, trait) {
            const obj: any = {
              groupId: traits._id,
              traitId: trait.traitId || j,
              traitName: trait.traitName
            };
            alltraitsArr.push(trait.traitName);
            allTraitsNegations.push(('!' + trait.traitName));
            tempTraitkey = trait.traitName.toUpperCase();
            if (!allTraitskeys[tempTraitkey]) {
              allTraitskeys[tempTraitkey] = {
                count: 1
              };
            } else {
              allTraitskeys[tempTraitkey].count = allTraitskeys[tempTraitkey].count + 1;
            }
            this.allTraits = _.uniq(alltraitsArr);
            this.allTraitsNegations = _.uniq(allTraitsNegations);
          });
        });
      } else {
        this.allTraits = _.uniq(alltraitsArr);
        this.allTraitsNegations = _.uniq(allTraitsNegations);
      }
      this.loadingTraits = false;
      if (!this.traits.traitGroups.length) {
        setTimeout(() => {
          $('.noTraits').scrollTop(3);
        }, 100);
      }
      this.traitCounts = allTraitskeys;
      if (res.length > 0) {
        this.loadingTraits = false;
        this.loadingTraits1 = true;
      }
      else {
        this.loadingTraits1 = true;
      }
    }, (err) => {
      this.loadingTraits = false;
    });
  };
  trainBot() {
    const quaryparms: any = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id,
    }
    this.service.invoke('train.traits', quaryparms).subscribe(res => {
      this.notificationService.notify('Trained successfully', 'success');
    }, (err) => {
      if (err && err.data && err.data.errors && err.data.errors[0]) {
        this.notificationService.notify(err.data.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed to train traits', 'error');
      }
    });
  };
  editTraitFroup = function (traitGroup, index) {
    this.editedContent = false;
    this.showEditTraitInput = null;
    this.currentGroupEditIndex = index;
    this.groupConfigs.matchStrategy = traitGroup.matchStrategy;
    this.traitDeleted = false;
    this.sliderMode = 'editGroup';
    if (traitGroup._id) {
      this.getTraitGroupById(traitGroup._id, null, traitGroup);
    }
  };
  saveTraits(traitsGroup?, byTraitId?) {
    this.submitted = true;
    if (!this.traits.addEditTraits.groupName || !this.traits.addEditTraits.groupName.trim()) {
      this.notificationService.notify('Please provide a valid trait group', 'error');
      return;
    }
    const traits: any = {};
    const self = this;
    let payload: any = {};
    const confirm = () => {
      if (!this.traits.addEditTraits.traits) {
        this.notificationService.notify('Please add at least one trait', 'error');
        return;
      } else if (this.traits.addEditTraits.traits && !(Object.keys(this.traits.addEditTraits.traits).length)) {
        this.notificationService.notify('Please add at least one trait', 'error');
        return;
      }
      if (traitsGroup && traitsGroup._id && !byTraitId) {
        this.updateTraitsApi(traitsGroup._id, payload);
      } else if (!byTraitId) {
        if (this.traits.traitGroups && this.traits.traitGroups.length) {
          let index = this.traits.traitGroups.findIndex((d) => d.groupName == payload.groupName);
          if (index > -1) {
            this.notificationService.notify('Trait group name is already added', 'error');
            return;
          }
        }
        this.createTraitsApi(payload);
      } else if (byTraitId) {
        this.updateTraitsById(this.traits.addEditTraits.traits[this.traits.selectedtrait].traitId, traitsGroup._id, payload);
      }
    }
    function cancel() {
      this.traits.selectedtraitDisplayName = this.traits.selectedtrait;
      return;
    }
    function cancelEdit() {
      this.closeModalSlider('#createEditTraitsSlider');
      return;
    }
    let traitsData: any = []
    if (this.traits.addEditTraits && this.traits.addEditTraits.traitsArray) {
      traitsData = [...this.traits.addEditTraits.traitsArray];
    }
    $.each(traitsData, (i, trait) => {
      const displayName = trait.key || trait.displayName;
      // const traitKey = angular.copy((trait.key || trait.displayName).replace(/\s/g,''));
      const traitKey = (trait.key || trait.displayName);
      trait.displayName = trait.displayName || displayName;
      if (trait.utterance !== undefined) {
        delete trait.utterance;
      }
      if (trait.key !== undefined) {
        delete trait.key;
      }
      if (trait.newKey !== undefined) {
        delete trait.newKey;
      }
      traits[traitKey] = trait;

    });
    if (!byTraitId) {
      payload = {
        groupName: this.traits.addEditTraits.groupName,
        matchStrategy: this.traits.addEditTraits.matchStrategy,
        scoreThreshold: (this.traits.addEditTraits.scoreThreshold),                                 //    need to confirm
        traits,
        // algo: this.traits.addEditTraits.algo || 'n_gram',
        // "sequenceLength": this.traits.addEditTraits.sequenceLength || 2

      };
      if (payload.algo === 'skip_gram') {
        payload.configuration = {
          skip_gram: {
            seqLength: this.traits.addEditTraits.configuration.skip_gram.seqLength || 2,
            maxSkipDistance: this.traits.addEditTraits.configuration.skip_gram.maxSkipDistance || 1
          }
        };
      }
      if (payload.algo === 'n_gram') {
        payload.configuration = {
          n_gram: {
            minVal: this.traits.addEditTraits.configuration.n_gram.minVal || 1,
            maxVal: this.traits.addEditTraits.configuration.n_gram.maxVal || 1
          }
        };
      }
      if (payload.scoreThreshold === undefined || payload.matchStrategy === 'pattern') {
        payload.scoreThreshold = 0.5;
      }
      if (traitsGroup && traitsGroup._id && this.traitDeleted) {
        confirm();
        // NotificationService.userConfirm(i18n.i18nString('one_or_more_traits_del_warning'), [confirm, cancelEdit], {okText: i18n.i18nString('confirm')}, '', undefined, i18n.i18nString('confirm_proceed')   );
      } else {
        confirm();
      }
    }
    if (byTraitId) {

      // const tempTraitKey =  angular.copy(this.traits.selectedtraitDisplayName.replace(/\s/g,''));
      const tempTraitKey = this.traits.selectedtraitDisplayName;
      // if(this.traits.selectedtrait.replace(/\s/g,'')  != tempTraitKey){
      if (this.traits.selectedtrait !== tempTraitKey) {
        payload = {
          traitName: this.traits.selectedtraitDisplayName,
          // 'traitKey': angular.copy(this.traits.selectedtraitDisplayName.replace(/\s/g,'')),
          traitKey: this.traits.selectedtraitDisplayName,
          traitId: this.traits.addEditTraits.traits[this.traits.selectedtrait].traitId,
          sourceId: this.traits.addEditTraits._id,
          destId: this.traits.selectedTraitGroupId,
          data: this.traits.addEditTraits.traits[this.traits.selectedtrait].data
        };
        // NotificationService.userConfirm(i18n.i18nString('trait_hintmsg1'), [confirm, cancel], {okText: i18n.i18nString('confirm')}, '', undefined, i18n.i18nString('are_you_sure'));

      } else {
        payload = {
          traitName: this.traits.selectedtraitDisplayName,
          // 'traitKey': angular.copy(this.traits.selectedtraitDisplayName.replace(/\s/g,'')),
          traitKey: this.traits.selectedtraitDisplayName,
          traitId: this.traits.addEditTraits.traits[this.traits.selectedtrait].traitId,
          sourceId: this.traits.addEditTraits._id,
          destId: this.traits.selectedTraitGroupId,
          data: this.traits.addEditTraits.traits[this.traits.selectedtrait].data
        };
        confirm();
      }

    }

  };
  deleteTraits(traits?, bulk?) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete ?',
        body: 'Selected trait group will be deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          if (bulk && this.selcectionObj.selectedCount > 1) {
            this.deleteBulkTrait(dialogRef);
          } else if (this.selcectionObj.selectedCount == 1) {
            let selectedIds = Object.keys(this.selcectionObj.selectedItems);
            let index = this.traits.traitGroups.findIndex((d) => { d._id == selectedIds[0] })
            this.deleteTrait(index, { _id: selectedIds[0] }, dialogRef);
          }
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  resetCheckBox() {
    this.selcectionObj.selectedItems = {};
    this.selcectionObj.selectedCount = 0;
    this.selcectionObj.selectAll = false;
    let partialElement: any = document.getElementsByClassName("partial-select-checkbox");
    if (partialElement.length) {
      partialElement[0].classList.add('d-none');
    }
    let selectAllElement: any = document.getElementsByClassName("select-all-checkbox");
    if (selectAllElement.length) {
      selectAllElement[0].classList.remove('d-none');
    }
    $('#selectAllTraits')[0].checked = false;
  }
  deleteTrait(index, traitsGroup, dialogRef) {
    if (!traitsGroup._id) {
      this.traits.traitGroups.splice(index, 1);
    } else {
      const traitslist = JSON.parse(JSON.stringify(this.traits.traitGroups));
      traitslist.splice(index, 1);
      const payload = traitslist;
      const quaryparms: any = {
        searchIndexId: this.serachIndexId,
        indexPipelineId: this.indexPipelineId,
        traitGroupId: traitsGroup._id
      }
      this.service.invoke('delete.traitGroup', quaryparms, payload).subscribe(res => {
        this.traitDeleted = false;
        this.resetCheckBox();
        this.getTraitsGroupsApi();
        dialogRef.close();
        this.notificationService.notify('Deleted Successfully', 'success');
      }, (err) => {
        if (err && err.data && err.data.errors && err.data.errors[0]) {
          this.notificationService.notify(err.data.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed to delete trait group', 'error');
        }
      });
    }
  }
  deleteBulkTrait(dialogRef) {
    const quaryparms: any = {
      searchIndexID: this.serachIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
      queryPipelineId: this.queryPipelineId
    };
    const triats = Object.keys(this.selcectionObj.selectedItems);
    const delateitems = {
      traitGroups: []
    };
    if (triats && triats.length) {
      triats.forEach(ele => {
        const obj = {
          _id: ele,
        }
        delateitems.traitGroups.push(obj);
      });
    }
    const payload = delateitems;
    this.service.invoke('delete.bulkTraits', quaryparms, payload).subscribe(res => {
      this.resetCheckBox();
      this.getTraitsGroupsApi();
      dialogRef.close();
      // this.closeModal();
      this.notificationService.notify('Trait Groups Deleted Successfully', 'success');
    }, errRes => {
      this.errorToaster(errRes, 'Failed to delete trait group');
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
  checkUncheckTraits(trait) {
    const selectedElements = $('.selectEachTraitInput:checkbox:checked');
    const allElements = $('.selectEachTraitInput');
    if (selectedElements.length === allElements.length) {
      let partialElement: any = document.getElementsByClassName("partial-select-checkbox");
      if (partialElement.length) {
        partialElement[0].classList.add('d-none');
      }
      let selectAllElement: any = document.getElementsByClassName("select-all-checkbox");
      if (selectAllElement.length) {
        selectAllElement[0].classList.remove('d-none');
      }
      $('#selectAllTraits')[0].checked = true;
    } else {
      let partialElement: any = document.getElementsByClassName("partial-select-checkbox");
      let selectAllElement: any = document.getElementsByClassName("select-all-checkbox");

      if (partialElement && (selectedElements.length != 0)) {
        partialElement[0].classList.remove('d-none');
        if (selectAllElement.length) {
          selectAllElement[0].classList.add('d-none');
        }
      }
      else {
        partialElement[0].classList.add('d-none');
        if (selectAllElement.length) {
          selectAllElement[0].classList.remove('d-none');
        }
      }
      $('#selectAllTraits')[0].checked = false;
    }
    const element = $('#' + trait._id);
    const addition = element[0].checked
    this.addRemoveTraitFromSelection(trait._id, addition);
  }
  addRemoveTraitFromSelection(TraitId?, addtion?, clear?) {
    if (clear) {
      this.resetPartial();
      const allTraits = $('.selectEachTraitInput');
      $.each(allTraits, (index, element) => {
        if ($(element) && $(element).length) {
          $(element)[0].checked = false;
        }
      });
      this.selcectionObj.selectedItems = {};
      this.selcectionObj.selectedCount = 0;
      this.selcectionObj.selectAll = false;
    } else {
      if (TraitId) {
        if (addtion) {
          this.selcectionObj.selectedItems[TraitId] = {};
        } else {
          if (this.selcectionObj.selectedItems[TraitId]) {
            delete this.selcectionObj.selectedItems[TraitId]
          }
        }
      }
      this.selcectionObj.selectedCount = Object.keys(this.selcectionObj.selectedItems).length;
    }
  }
  deleteTraitsGroup(index, traitsGroup, event?) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete ?',
        body: 'Selected trait group will be deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger', class: 'deleteBtn' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }

    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          if (!traitsGroup._id) {
            this.traits.traitGroups.splice(index, 1);
          } else {
            const traitslist = JSON.parse(JSON.stringify(this.traits.traitGroups));
            traitslist.splice(index, 1);
            const payload = traitslist;
            const quaryparms: any = {
              // userId: this.authService.getUserId(),
              // streamId: this.selectedApp._id,
              searchIndexId: this.serachIndexId,
              indexPipelineId: this.indexPipelineId,
              traitGroupId: traitsGroup._id
            }
            this.service.invoke('delete.traitGroup', quaryparms, payload).subscribe(res => {
              this.getTraitsGroupsApi();
              this.traitDeleted = false;
              this.resetCheckBox();
              dialogRef.close();
              this.notificationService.notify('Deleted Successfully', 'success');
            }, (err) => {
              if (err && err.data && err.data.errors && err.data.errors[0]) {
                this.notificationService.notify(err.data.errors[0].msg, 'error');
              } else {
                this.notificationService.notify('Failed to delete trait group', 'error');
              }
            });
          }
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  };
  closeCreate() {
    this.traitDeleted = false;
    this.add = {
      traitName: ''
    };
    this.closeStatusModal();
    this.sliderMode = '';
  };
  updateTraitsApi(traitGroupId, payload) {
    const quaryparms: any = {
      // userId: this.authService.getUserId(),
      // streamId: this.selectedApp._id,
      searchIndexId: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      traitGroupId
    }
    this.service.invoke('update.traitGroup', quaryparms, payload).subscribe(res => {
      this.getTraitsGroupsApi();
      this.traitDeleted = false;
      this.closeCreate();
      this.notificationService.notify('Updated Successfully', 'success');
    }, (err) => {
      if (err && err.data && err.data.errors && err.data.errors[0]) {
        this.notificationService.notify(err.data.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed to updated trait group', 'error');
      }
    });
  };
  createTraitsApi(payload) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      indexPipelineId: this.indexPipelineId
      // userId: this.authService.getUserId(),
      // streamId: this.selectedApp._id,
    }
    this.service.invoke('create.traitGroup', quaryparms, payload).subscribe(res => {
      this.getTraitsGroupsApi();
      this.closeCreate();
      this.traits.addEditTraits = {};
      this.traits.addEditTraits.matchStrategy = 'probability';
      this.notificationService.notify('Created Successfully', 'success');
    }, (err) => {
      if (err && err.error && err.error.errors && err.error.errors[0]) {
        this.notificationService.notify(err.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed to create trait', 'error');
      }
    });
  };
  getTraitGroupById(groupId, traitKey) {
    const self = this
    const quaryparms: any = {
      // userId: this.authService.getUserId(),
      // streamId: this.selectedApp._id,
      searchIndexId: this.serachIndexId,
      indexPipelineId: this.indexPipelineId,
      traitGroupId: groupId,
    }
    this.service.invoke('get.traitGroupById', quaryparms).subscribe(res => {
      this.traits.addEditTraits = res;
      res.configuration = res.configuration || {};
      if (!traitKey) {
        this.traits.addEditTraits.traitsArray = [];
        $.each(this.traits.addEditTraits.traits, (key, value) => {
          value.key = key;
          self.traits.addEditTraits.traitsArray.push(value);
        });
        this.groupConfigs.matchStrategy = res.matchStrategy || 'probability';
        this.groupConfigs.algo = res.algo || 'n_gram';
        if (res.scoreThreshold > -1) {
          this.groupConfigs.scoreThreshold = res.scoreThreshold;
        } else {
          this.groupConfigs.scoreThreshold = 0.5;
        }
        this.groupConfigs.configuration = res.configuration;
        this.groupConfigs.configuration = {
          skip_gram: res.configuration.skip_gram || { ...this.defaultGroupConfigs.configuration.skip_gram },
          n_gram: res.configuration.n_gram || { ...this.defaultGroupConfigs.configuration.n_gram }
        };
      }
      this.openStatusModal();
    }, (err) => {
      this.notificationService.notify('Failed to get Trait', 'error');
    });
  };
  getTraitsById(traitId, traitGroup) {
    const quaryparms: any = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id,
      traitGroupId: traitGroup._id,
      traitId,
    }
    this.service.invoke('get.traits', quaryparms).subscribe(res => {
      this.traits.selectedtrait = res.key || res.traitName;
      this.selectedTraitKey = res.key || res.traitName;
      this.traits.addEditTraits = JSON.parse(JSON.stringify(traitGroup));
      this.traits.addEditTraits.traits = {};
      this.traits.addEditTraits.traits[this.traits.selectedtrait] = res;
      // this.traits.selectedtraitDisplayName = angular.copy(res.displayName || res.traitName);
      this.traits.selectedtraitDisplayName = res.traitName;
      this.traits.selectedTraitObj = res;
      // this.openModalSlider('#createEditTraitsSlider');
    }, (err) => {
      this.notificationService.notify('Failed to fetch traits', 'error');
    });
  };
  updateTraitsById(traitId, groupId, payload) {
    const quaryparms: any = {
      userId: this.authService.getUserId(),
      streamId: this.selectedApp._id,
      traitGroupId: groupId,
      traitId,
    }
    this.service.invoke('get.traits', quaryparms, payload).subscribe(res => {
      this.notificationService.notify('Updated SuccessFully', 'success');
      this.getTraitsGroupsApi();
      // this.closeModalSlider('#createEditTraitsSlider');
      this.sliderMode = '';
    }, (err) => {
      if (err.data.errors.length > 0) {
        this.notificationService.notify(err.data.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed to save trait', 'error');
      }
    });
  };
  createNewTraits() {
    this.traits.addEditTraits = {};
    this.traits.addEditTraits = JSON.parse(JSON.stringify(this.defaultGroupConfigs));
    this.groupConfigs = JSON.parse(JSON.stringify(this.defaultGroupConfigs));
    this.sliderMode = 'createGroup';
    this.traits.search = '';
    this.editedContent = false;
    this.traitDeleted = false;
    this.openStatusModal();
    setTimeout(() => {
      // this.bindSearchEvents();
    }, 300);
  };
  accordianAction(index) {
    if (this.currentTraitEditIndex === index) {
      this.currentTraitEditIndex = null;
    } else {
      this.currentTraitEditIndex = index
    }
  }
  openStatusModal() {
    this.currentTraitEditIndex = null;
    this.statusModalPopRef = this.statusModalPop.open();
    setTimeout(() => {
      this.perfectScroll.directiveRef.update();
      this.perfectScroll.directiveRef.scrollToTop();
    }, 400)
  }
  closeStatusModal() {
    this.submitted = false;
    if (this.statusModalPopRef && this.statusModalPopRef.close) {
      this.statusModalPopRef.close();
    }
  }
  openAddUtteranceModel(index, key, utteranceList, isView = false) {
    if (isView && !utteranceList.length) {
      return;
    }
    this.showUtteranceInput = isView ? false : true;
    this.showEditUtteranceInput = null;
    this.newUtterance = '';
    this.utteranceList = [];
    this.utteranceList = [...utteranceList, ...this.utteranceList];
    this.currentUtteranceIndex = index;
    this.currentTraitKey = key;
    this.addUtteranceModalPopRef = this.addUtteranceModalPop.open();
    setTimeout(() => {
      this.perfectScroll2.directiveRef.update();
      this.perfectScroll2.directiveRef.scrollToTop();
    }, 400)
  }
  closeUtteranceModal() {
    this.currentUtteranceIndex = null;
    this.currentTraitKey = null;
    this.utteranceList = [];
    this.newUtterance = '';
    this.uttSubmitted = false;
    if (this.addUtteranceModalPopRef && this.addUtteranceModalPopRef.close) {
      this.addUtteranceModalPopRef.close();
    }
  }
  addTraits(traitName, event) {
    const traits = [];
    if (traitName.trim() !== '') {
      if (event && event.keyCode === 13) {
        if (!traitName || traitName === '') {
          return false;
        }
        if (this.checkForSecialChar(traitName, false, 'traits')) {
          // this.notificationService.notify("Trait names can only contain alphanumeric characters, spaces and underscores.", 'error');
          return false;
        }
        if (this.traits.addEditTraits.traits === undefined) {
          this.traits.addEditTraits.traits = {};
        }

        if (this.traits.addEditTraits.traitsArray === undefined) {
          this.traits.addEditTraits.traitsArray = [];
        }
        this.add = {
          traitName: ''
        };
        const tempTraitKey = traitName;
        if (!this.traits.addEditTraits.traits[tempTraitKey]) {
          const dummyTraitsObj = {};
          dummyTraitsObj[tempTraitKey] = {
            data: [],
            displayName: traitName,
            key: tempTraitKey,
            newKey: true
          };
          Object.assign(dummyTraitsObj, (this.traits.addEditTraits.traits || {}));
          this.traits.addEditTraits.newTrait = traitName;
          this.traits.addEditTraits.traits = JSON.parse(JSON.stringify(dummyTraitsObj));
          traits.push(dummyTraitsObj[tempTraitKey]);
          this.traits.addEditTraits.traitsArray = traits.concat(this.traits.addEditTraits.traitsArray);
          // this.traits.addEditTraits.traitsArray.push(dummyTraitsObj[tempTraitKey]);
          setTimeout(() => {
            if ($('#0traitsAccordian').hasClass('closedAccordian')) {
              $('#0traitsAccordian').click();
            }
          }, 100);
        } else {
          this.notificationService.notify(traitName + ' is already added', 'error');
        }

      }
    }
  };
  addNewUtter(utter, event) {
    const utteranceData = [];
    if (event && (event.keyCode === 13 || event.type == 'click') && utter) {
      let utternaceIndex = -1;
      const utteranceSearch = _.find(this.utteranceList, (utterance, i) => {
        if (utter === utterance) {
          utternaceIndex = i;
          return false;
        }
      });
      if (utternaceIndex > -1) {
        this.notificationService.notify('Utterance is already added', 'error');
        return;
      }
      this.utteranceList = [utter].concat(this.utteranceList);
      this.newUtterance = '';
      this.showUtteranceInput = true;
    }
  }
  addUtterance(utter, key, event, traitsGroup, index) {
    const utteranceData = [];
    if (event && event.keyCode === 13 && traitsGroup && utter !== '') {
      let utternaceIndex = -1;
      const utteranceSearch = _.find(traitsGroup.traits[key].data, (utterance, i) => {
        if (utter === utterance) {
          utternaceIndex = i;
          return false;
        }
      });
      if (utternaceIndex > -1) {
        this.notificationService.notify('Utterance is already added', 'error');
        return;
      }
      utteranceData.push(utter);
      this.traits.addEditTraits.traits[key].data = utteranceData.concat(this.traits.addEditTraits.traits[key].data);
      // this.traits.addEditTraits.traits[key].data.push(utter);
      if (index > -1) {
        this.traits.addEditTraits.traitsArray[index] = this.traits.addEditTraits.traits[key];
      }
      this.traits.addEditTraits.traits[key].utterance = '';
    }
  }
  removeUtterances(index, parentIndex) {
    this.traitsObj[parentIndex].utterances.splice(index, 1);
  }
  deleteTraitInGroup = function (key, traitsGroup, event, traitIndex) {
    if (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Trait',
        text: 'Are you sure you want to delete Trait ?',
        newTitle: 'Are you sure you want to delete ?',
        body: 'Selected trait and utterances will be deleted. ',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger', class: 'deleteBtn' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }

    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.traitDeleted = true;
          delete traitsGroup.traits[key];
          traitsGroup.traitsArray.splice(traitIndex, 1);
          dialogRef.close();
        }
        else if (result === 'no') {
          dialogRef.close();
        }
      });
  }

  deleteUtteranceIntrait(deletedutternace, key, traitsGroup, traitIndex) {
    let utternaceIndex = null;
    const utteranceSearch = _.find(traitsGroup.traits[key].data, (utterance, i) => {
      if (deletedutternace === utterance) {
        utternaceIndex = i;
        return false;
      }
    });
    if (utternaceIndex !== null) {
      traitsGroup.traits[key].data.splice(utternaceIndex, 1);
    }
    if (traitIndex > -1) {
      this.traits.addEditTraits.traitsArray[traitIndex].data = traitsGroup.traits[key].data;
    }
  };
  saveTraitsData() {
    //  this.traitsTableData
    if (this.traitsObj && this.traitsObj.length) {
      const mockData = {
        traitType: this.traitType,
        traits: this.traitsObj
      };
      this.traitsTableData.push(mockData);
      // console.log(this.traitsObj);
      this.traitsObj = [];
      this.traitType = '';
      this.emptyData = false;
      this.closeStatusModal();
    }
  }
  checkForSecialChar(str, allowNegation, stringTitle) { // as of now only used for traits needs to update based on future requirment on reusability
    stringTitle = stringTitle || '';
    let characters = /[\=\`\~\!@#\$\%\^&\*\(\)\-\+\{\}\:"\[\];\',\.\/<>\?\|\\]+/;
    if (allowNegation && /[!]/.test(str)) {
      if (str && str[0] !== '!') {
        this.notificationService.notify('Negations are allowed only at the beginning of the' + stringTitle + ' name', 'error');
        return true;
      }
      characters = /[\=\`\~\@#\$\%\^&\*\(\)\-\+\{\}\:"\[\];\',\.\/<>\?\|\\]+/;
      if (str && str[0] === '!') {
        let testStringNeagtion = str;
        testStringNeagtion = testStringNeagtion.slice(1, str.length);
        if (/[!]/.test(testStringNeagtion)) {
          this.notificationService.notify('Negations are allowed only at the beginning of the trait name', 'error');
          return true;
        }
      }
      if (stringTitle === 'traits') {
        stringTitle = 'Traits';
      }
      if (str && str[0] === '!' && str.length === 1) {
        this.notificationService.notify(stringTitle + ' names can only contain alphanumeric characters, spaces and underscores.', 'error');
        return true;
      }
    }
    if (characters.test(str)) {
      if (stringTitle === 'traits') {
        stringTitle = 'Traits';
      }
      this.notificationService.notify(stringTitle + ' names can only contain alphanumeric characters, spaces and underscores.', 'error');
      return true;
    }
    // underscores and spaces are not included here//
    return characters.test(str);
  };
  toggleSearch() {
    if (this.showSearch && this.serachTraits) {
      this.serachTraits = '';
    }
    this.showSearch = !this.showSearch
  };

  addNewUtterance(key, traitsGroup, index) {
    const utteranceData = [];
    this.uttSubmitted = true;
    if (!this.utteranceList || !this.utteranceList.length) {
      this.notificationService.notify('Please provide a valid utterance', 'error');
      return
    }
    if (traitsGroup && this.utteranceList.length) {
      this.traits.addEditTraits.traits[key].data = this.utteranceList;
      if (index > -1) {
        this.traits.addEditTraits.traitsArray[index] = this.traits.addEditTraits.traits[key];
      }
      this.traits.addEditTraits.traits[key].utterance = '';
    }
    this.closeUtteranceModal();
  }

  deleteUtterance = function (deletedutternace, event) {
    if (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Utterance',
        text: 'Are you sure you want to delete Utterance ?',
        newTitle: 'Are you sure you want to delete ?',
        body: 'Selected utterance will be deleted. ',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger', class: 'deleteBtn' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }

    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          let utternaceIndex = null;
          const utteranceSearch = _.find(this.utteranceList, (utterance, i) => {
            if (deletedutternace === utterance) {
              utternaceIndex = i;
              this.utteranceList.splice(utternaceIndex, 1);
              return false;
            }
          });
          dialogRef.close();
        }
        else if (result === 'no') {
          dialogRef.close();
        }
      });
  }

  editUtter(event, utter, index) {
    if (event && (event.keyCode === 13 || event.type == 'click') && utter !== '') {
      let utternaceIndex = -1;
      const utteranceSearch = _.find(this.utteranceList, (utterance, i) => {
        if (utter === utterance && index !== i) {
          utternaceIndex = i;
          return false;
        }
      });
      if (utternaceIndex > -1) {
        this.notificationService.notify('Utterance is already added', 'error');
        return;
      }
      this.showEditUtteranceInput = null;
      this.showUtteranceInput = false;
      this.utteranceList[index] = utter;
    }
  }

  editTraits(trait, event, displayName) {
    if (event && (event.keyCode === 13 || event.type == 'click') && trait !== '') {
      if (!this.traits.addEditTraits.traits[trait]) {
        this.showEditTraitInput = null;
        this.traits.addEditTraits.traits[displayName].displayName = trait;
        this.traits.addEditTraits.traits[trait] = this.traits.addEditTraits.traits[displayName];
        delete this.traits.addEditTraits.traits[displayName];
      } else if (this.traits.addEditTraits.traits[trait] && displayName == trait) {
        this.showEditTraitInput = null;
      } else {
        this.notificationService.notify(trait + ' is already added', 'error');
      }
    }
  }

  showEditTrait(index, event) {
    if (event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
    this.showEditTraitInput = index;
  }
  focusoutSearch() {
    if (this.activeClose) {
      this.serachTraits = '';
      this.activeClose = false;
    }
    this.showSearch = !this.showSearch;
  }
  focusinSearch(inputSearch) {
    setTimeout(() => {
      document.getElementById(inputSearch).focus();
    }, 100)
  }
  selectAll(unselectAll?) {
    const allTraits = $('.selectEachTraitInput');
    if (allTraits && allTraits.length) {
      $.each(allTraits, (index, element) => {
        if ($(element) && $(element).length) {
          $(element)[0].checked = unselectAll ? false : this.selcectionObj.selectAll;
          const traitId = $(element)[0].id
          this.addRemoveTraitFromSelection(traitId, $(element)[0].checked);
        }
      });
    };
    let partialElement: any = document.getElementsByClassName("partial-select-checkbox");
    if (partialElement.length) {
      partialElement[0].classList.add('d-none');
    }
    let selectAllElement: any = document.getElementsByClassName("select-all-checkbox");
    if (selectAllElement.length) {
      selectAllElement[0].classList.remove('d-none');
    }
    if (unselectAll) {
      $('#selectAllTraits')[0].checked = false;
    }
  }
  resetPartial() {
    this.selcectionObj.selectAll = false;
    if ($('#selectAllTraits').length) {
      $('#selectAllTraits')[0].checked = false;
    }
    let partialElement: any = document.getElementsByClassName("partial-select-checkbox");
    if (partialElement.length) {
      partialElement[0].classList.add('d-none');
    }
    let selectAllElement: any = document.getElementsByClassName("select-all-checkbox");
    if (selectAllElement.length) {
      selectAllElement[0].classList.remove('d-none');
    }
  }
  selectAllFromPartial() {
    this.selcectionObj.selectAll = true;
    $('#selectAllTraits')[0].checked = true;
    this.selectAll();
  }
  paginate(event){
    this.skip= event.skip;
    this.getTraitsGroupsApi()
  }

  ngOnDestroy() {
    const self = this;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }
}
