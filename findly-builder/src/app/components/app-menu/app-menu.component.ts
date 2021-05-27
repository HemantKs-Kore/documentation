import { Component, OnInit, ViewEncapsulation, HostListener, Input, ViewChild, OnDestroy } from '@angular/core';
import { SideBarService } from '../../services/header.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ActivatedRoute, Routes, Router } from '@angular/router';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { AppSelectionService } from '@kore.services/app.selection.service'
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '@kore.services/notification.service';
import { DockStatusService } from '../../services/dockstatusService/dock-status.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { UpgradePlanComponent } from 'src/app/helpers/components/upgrade-plan/upgrade-plan.component';
import * as _ from 'underscore';
declare const $: any;
@Component({
  selector: 'app-mainmenu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppMenuComponent implements OnInit, OnDestroy {

  selected = '';
  trainingMenu = false;
  addFieldModalPopRef: any;
  addIndexFieldModalPopRef: any;
  statusDockerModalPopRef: any;
  loadingQueryPipelines: any = true;
  queryConfigs: any = [];
  indexConfigs: any = [];
  newConfigObj: any = {
    method: 'default',
    name: ''
  };
  newIndexConfigObj: any = {
    method: 'default',
    name: ''
  }
  searchPipeline: any = '';
  queryConfigsRouts: any = {
    '/synonyms': true,
    '/stopWords': true,
    '/weights': true,
    '/facets': true,
    '/resultranking': true,
    '/rules': true,
  }
  searchIndexId;
  selectedApp;
  usageDetails: any = {};
  configObj: any = {};
  selectedConfig: any = {};
  indexConfigObj: any = {};
  selectedIndexConfig: any = {};
  subscription: Subscription;
  indexSub: Subscription;
  editName: boolean = false;
  editNameVal: String = "";
  editIndexName: boolean = false;
  editIndexNameVal: String = "";
  submitted: boolean = false;
  public showStatusDocker: boolean = false;
  public statusDockerLoading: boolean = false;
  public dockersList: Array<any> = [];
  showUpgrade: boolean;
  currentSubsciptionData: Subscription;
  subscriptionDocumentLimit: Subscription;
  @Input() show;
  @Input() settingMainMenu;
  @Input() sourceMenu;
  @ViewChild('addIndexFieldModalPop') addIndexFieldModalPop: KRModalComponent;
  @ViewChild('addFieldModalPop') addFieldModalPop: KRModalComponent;
  @ViewChild('statusDockerModalPop') statusDockerModalPop: KRModalComponent;
  @ViewChild('plans') plans: UpgradePlanComponent;
  constructor(private service: ServiceInvokerService,
    private headerService: SideBarService,
    private workflowService: WorkflowService,
    private router: Router, private activetedRoute: ActivatedRoute,
    private notify: NotificationService,
    private appSelectionService: AppSelectionService,
    public dockService: DockStatusService,
    public dialog: MatDialog
  ) {
  }
  goHome() {
    this.workflowService.selectedApp(null);
    this.router.navigate(['/apps'], { skipLocationChange: true });
  };
  preview(selection) {
    const toogleObj = {
      title: selection,
    };
    this.headerService.toggle(toogleObj);
  }
  //upgrade plan
  upgrade() {
    // var all = document.getElementsByClassName('query-limited-reached');
    // console.log("all", all)
    this.plans.openChoosePlanPopup('choosePlans');
  }
  reloadCurrentRoute() {
    let route = '/summary';
    const previousState = this.appSelectionService.getPreviousState();
    if (previousState.route) {
      route = previousState.route
    }
    try {
      if (route && this.queryConfigsRouts[route]) {
        if (this.workflowService.selectedApp() && this.workflowService.selectedApp().searchIndexes && this.workflowService.selectedApp().searchIndexes.length) {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([route], { skipLocationChange: true });
          });
        }
      }
    } catch (e) {
    }
  }
  selectDefault() {
    this.newConfigObj._id = this.selectedConfig;
  }
  editIndexConfig(config, action) {
    this.editIndexName = true;
    this.editIndexNameVal = config.name;
    this.selectIndexPipelineId(config, null, 'edit')
  }
  editConfig(config, action) {
    this.editName = true;
    this.editNameVal = config.name;
    this.selectQueryPipelineId(config, null, 'edit')
  }
  markAsDefaultIndex(config, action?) {
    this.editIndexName = false;
    const queryParms = {
      indexPipelineId: config._id,
      searchIndexId: this.searchIndexId
    }
    let payload = {}
    if (action == 'edit') {
      payload = {
        name: this.editIndexNameVal,
      }
    } else {
      payload = {
        default: true,
      }
    }
    this.service.invoke('put.newIndexPipeline', queryParms, payload).subscribe(
      res => {
        if (action === 'edit') {
          this.notify.notify('Index congfiguration updated successfully', 'success');
        }
        else {
          this.notify.notify('Set to default Index successfully', 'success');
        }
        this.appSelectionService.getIndexPipelineIds(config);
        if (config && config._id && action !== 'edit') {
          this.selectQueryPipelineId(config);
        }
        this.closeIndexModalPopup();
      },
      errRes => {
        this.errorToaster(errRes, 'Failed to Create indexPipeline');
      }
    );
  }
  markAsDefault(config, action?) {
    this.editName = false;
    const queryParms = {
      queryPipelineId: config._id,
      searchIndexId: this.searchIndexId,
      indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
    }
    let payload = {}
    if (action == 'edit') {
      payload = {
        name: this.editNameVal,
      }
    } else {
      payload = {
        default: true,
      }
    }
    this.service.invoke('put.queryPipeline', queryParms, payload).subscribe(
      res => {
        if (action == 'edit') {
          this.notify.notify('Search congfiguration updated successfully', 'success');
        }
        else {
          this.notify.notify('Set to default successfully', 'success');
        }
        this.appSelectionService.getQureryPipelineIds(config);
        if (config && config._id && action !== 'edit') {
          this.selectQueryPipelineId(config);
        }
      },
      errRes => {
        this.errorToaster(errRes, 'Failed to set successfully');
      }
    );
  }
  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notify.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notify.notify(message, 'error');
    } else {
      this.notify.notify('Somthing went worng', 'error');
    }
  }

  validateIndexConfig() {
    if (this.newIndexConfigObj && this.newIndexConfigObj.name.length) {
      if (this.newIndexConfigObj.method === 'clone' && this.newIndexConfigObj.index_config_name.length) {
        this.submitted = false;
        return true;
      }
      else if (this.newIndexConfigObj.method === 'clone' && !this.newIndexConfigObj.index_config_name.length) {
        return false;
      }
      else {
        this.submitted = false;
        return true;
      }
    }
    else {
      return false;
    }
  }
  createIndexConfig() {
    this.submitted = true;
    if (this.validateIndexConfig()) {
      let payload: any = {
        method: this.newIndexConfigObj.method,
        name: this.newIndexConfigObj.name,
      }
      if (this.newIndexConfigObj.method === 'clone') {
        payload = { ...payload, sourceIndexPipelineId: this.newIndexConfigObj.index_config_id }
      }
      const queryParms = {
        searchIndexId: this.searchIndexId
      }
      this.service.invoke('post.newIndexPipeline', queryParms, payload).subscribe(
        res => {
          if (res && res._id) {
            if (this.newIndexConfigObj.method === 'clone') {
              this.notify.notify('New Index config cloned successfully', 'success');
            } else {
              this.notify.notify('New Index config created successfully', 'success');
            }
            this.selectIndexPipelineId(res);
          }
          this.closeIndexModalPopup();
        },
        errRes => {
          if (errRes && errRes.error && errRes.error.errors[0].code == 'FeatureAccessLimitExceeded') {
            this.closeIndexModalPopup();
            this.errorToaster(errRes, errRes.error.errors[0].msg);
            this.upgrade();
          }
          else {
            this.errorToaster(errRes, 'Failed to Create indexPipeline');
          }
        }
      );
    }
    else {
      this.notify.notify('Enter the required fields to proceed', 'error');
    }
  }

  validateSearchConfig() {
    if (this.newConfigObj && this.newConfigObj.name.length) {
      if (this.newConfigObj.method === 'clone' && this.newConfigObj.config_name.length) {
        this.submitted = false;
        return true;
      }
      else if (this.newConfigObj.method === 'clone' && !this.newConfigObj.config_name.length) {
        return false;
      }
      else {
        this.submitted = false;
        return true;
      }
    }
    else {
      return false;
    }
  }
  createConfig() {
    this.submitted = true;
    if (this.validateSearchConfig()) {
      const payload: any = {
        method: this.newConfigObj.method,
        name: this.newConfigObj.name,
      }
      if (this.newConfigObj.method === 'clone') {
        payload.sourceQueryPipelineId = this.newConfigObj.config_id
      }
      const queryParms = {
        searchIndexId: this.searchIndexId,
        indexPipelineId: this.workflowService.selectedIndexPipeline() || ''
      }
      this.service.invoke('create.queryPipeline', queryParms, payload).subscribe(
        res => {
          console.log("search config", res)
          this.appSelectionService.getQureryPipelineIds();
          if (res && res._id) {
            this.selectQueryPipelineId(res);
          }
          this.closeModalPopup();
          if (this.newConfigObj.method === 'clone') {
            this.notify.notify('New Search config cloned successfully', 'success');
          }
          else {
            this.notify.notify('New Search config created successfully', 'success');
          }
        },
        errRes => {
          if (errRes && errRes.error && errRes.error.errors[0].code == 'FeatureAccessLimitExceeded') {
            this.closeModalPopup();
            this.errorToaster(errRes, errRes.error.errors[0].msg);
            this.upgrade();
          } else {
            this.errorToaster(errRes, 'Failed to Create searchconfig');
          }
        }
      );
    }
    else {
      this.notify.notify('Enter the required fields to proceed', 'error');
    }
  }
  selectQueryPipelineId(queryConfigs, event?, type?) {
    console.log("queryConfigs", queryConfigs)
    if (event && !this.editName) {
      event.close();
    }
    if (this.editName && type) {
      this.editName = true
    } else {
      this.editName = false;
      //event.close();
    }
    this.appSelectionService.selectQueryConfig(queryConfigs);
    this.selectedConfig = queryConfigs._id;
    this.reloadCurrentRoute()
  }
  deleteIndexPipeLine(indexConfigs, dialogRef, type) {
    console.log("index query", indexConfigs)
    let queryParms = {
      searchIndexId: this.searchIndexId,
      indexPipelineId: type == 'index' ? indexConfigs._id : this.workflowService.selectedIndexPipeline()
    }
    if (type == 'search') {
      queryParms = Object.assign(queryParms, { queryPIpelineId: indexConfigs._id });
    }
    const url = type == 'index' ? 'delete.indexPipeline' : 'delete.queryPipeline';
    this.service.invoke(url, queryParms).subscribe(
      res => {
        dialogRef.close();
        const deleteIndex = _.findIndex(type == 'index' ? this.indexConfigs : this.queryConfigs, (pg) => {
          return pg._id === indexConfigs._id;
        })
        if (type == 'index') {
          this.indexConfigs.splice(deleteIndex, 1);
        }
        else {
          this.queryConfigs.splice(deleteIndex, 1);
        }
        this.notify.notify('deleted successfully', 'success');
      },
      errRes => {
        this.errorToaster(errRes, 'Faile to delete.');
      }
    );
  }
  selectIndexPipelineId(indexConfigs, event?, type?) {
    if (event) {
      event.close();
    }
    if (this.editIndexName && type) {
      this.editIndexName = true
    } else {
      this.editIndexName = false;
      //event.close();
    }
    //this.workflowService.selectedSearchIndex(indexConfigs._id)
    this.appSelectionService.getIndexPipelineIds(indexConfigs)
    this.selectedIndexConfig = indexConfigs._id;
    //this.reloadCurrentRoute()
  }
  onKeypressEvent(e, config) {
    if (e) {
      e.stopPropagation();
    }
    if (e.keyCode == 13) {
      this.markAsDefault(config, 'edit')
      return false;
    }
  }
  onKeypressIndexEvent(e, config) {
    if (e) {
      e.stopPropagation();
    }
    if (e.keyCode == 13) {
      this.markAsDefaultIndex(config, 'edit')
      return false;
    }
  }
  async ngOnInit() {
    this.selectedApp = this.workflowService.selectedApp();
    // this.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    // Multiple INdex hardcoded
    await this.appSelectionService.getCurrentSubscriptionData();
    this.currentSubsciptionData = this.appSelectionService.currentSubscription.subscribe(res => {
      this.showUpgrade = res.subscription.planId == 'fp_free' ? true : false;
    })
    this.subscriptionDocumentLimit = this.appSelectionService.currentDocumentLimit.subscribe(res => {
      this.getCurrentUsage();
    })
    this.appSelectionService.appSelectedConfigs.subscribe(res => {
      this.getCurrentUsage();
      this.indexConfigs = res;
      this.indexConfigs.forEach(element => {
        this.indexConfigObj[element._id] = element;
      });
      if (res.length > 0)
        this.selectedIndexConfig = this.workflowService.selectedIndexPipeline();
    })
    this.subscription = this.appSelectionService.queryConfigs.subscribe(res => {
      this.queryConfigs = res;
      res.forEach(element => {
        this.configObj[element._id] = element;
      });
      this.selectedConfig = this.workflowService.selectedQueryPipeline()._id;
      setTimeout(() => {
        this.selectedApp = this.workflowService.selectedApp();
        if (this.selectedApp.searchIndexes.length) {
          this.searchIndexId = this.selectedApp.searchIndexes[0]._id;
          console.log('SI - ', this.selectedApp.searchIndexes[0]._id);
        }
      }, 1000)
    })
    if (this.selectedApp.searchIndexes.length) {
      this.searchIndexId = this.selectedApp.searchIndexes[0]._id
    }
    // this.indexConfigs.forEach(element => {
    //   this.indexConfigObj[element._id] = element;
    // });
    // this.selectedConfig = 'fip-29dee24c-0be2-5ca3-9340-b3fcb9ea965a';
    // this.getCurrentUsage();
  }
  //get current usage data of search and queries
  getCurrentUsage() {
    this.selectedApp = this.workflowService.selectedApp();
    const queryParms = {
      streamId: this.selectedApp._id
    }
    const payload = { "features": ["ingestDocs", "searchQueries"] };
    this.service.invoke('post.usageData', queryParms, payload).subscribe(
      res => {
        let docs = Number.isInteger(res.ingestDocs.percentageUsed) ? (res.ingestDocs.percentageUsed) : parseFloat(res.ingestDocs.percentageUsed).toFixed(2);
        let queries = Number.isInteger(res.searchQueries.percentageUsed) ? (res.searchQueries.percentageUsed) : parseFloat(res.searchQueries.percentageUsed).toFixed(2);
        this.usageDetails = { ingestDocs: docs, searchQueries: queries };
      },
      errRes => {
        this.errorToaster(errRes, 'Failed to get current data.');
      }
    );
  }
  // toggle sub-menu
  switchToTerminal() {
    this.closeModalPopup();
  }
  toggleTranningMenu() {
    this.trainingMenu === false ? this.trainingMenu = true : this.trainingMenu = false;
  }
  closeModalPopup() {
    this.submitted = false;
    this.addFieldModalPopRef.close();
    this.newConfigObj = {
      method: 'default',
      name: '',
      config_name: '',
      config_id: ''
    };
  }
  closeIndexModalPopup() {
    this.submitted = false;
    this.addIndexFieldModalPopRef.close();
    this.newIndexConfigObj = {
      method: 'default',
      name: '',
      index_config_name: '',
      index_config_id: ''
    };
  }
  openModalPopup(type, config) {
    this.newConfigObj = {
      method: type,
      name: '',
      config_name: config !== undefined ? config.name : '',
      config_id: config !== undefined ? config._id : ''
    };
    this.submitted = false;
    this.addFieldModalPopRef = this.addFieldModalPop.open();
    setTimeout(() => {
      $('#createQueryConfig').blur();
    }, 100)
  }
  openIndexModalPopup(type, config) {
    this.newIndexConfigObj = {
      method: type,
      name: '',
      index_config_name: config !== undefined ? config.name : '',
      index_config_id: config !== undefined ? config._id : ''
    };
    this.submitted = false;
    this.addIndexFieldModalPopRef = this.addIndexFieldModalPop.open();
    setTimeout(() => {
      $('#createIndexConfig').blur();
    }, 100)
  }
  // Controlling the Status Docker Opening
  openStatusDocker() {
    if (this.dockService.showStatusDocker) {
      this.statusDockerLoading = true;
      // this.getDockerData();
    }
  }

  getDockerData() {
    const queryParms = {
      searchIndexId: this.searchIndexId
    }
    this.service.invoke('get.dockStatus', queryParms).subscribe(
      res => {
        this.statusDockerLoading = false;
        this.dockersList = res.dockStatuses;
      },
      errRes => {
        this.statusDockerLoading = false;
        this.errorToaster(errRes, 'Failed to get Status of Docker.');
      }
    );
  }
  deleteIndexConfig(config, type) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete ?',
        body: `Selected ${type == 'index' ? 'Index' : 'Search'} will be deleted from the app.`,
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.deleteIndexPipeLine(config, dialogRef, type)
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }
  selectIndexConfig(config) {
    this.newIndexConfigObj.index_config_name = config.name;
    this.newIndexConfigObj.index_config_id = config._id;
  }
  selectConfig(config) {
    this.newConfigObj.config_name = config.name;
    this.newConfigObj.config_id = config._id;
  }
  ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : false;
    this.indexSub ? this.indexSub.unsubscribe() : false;
    this.currentSubsciptionData ? this.currentSubsciptionData.unsubscribe() : false;
    this.subscriptionDocumentLimit ? this.subscriptionDocumentLimit.unsubscribe() : false;
  }
}