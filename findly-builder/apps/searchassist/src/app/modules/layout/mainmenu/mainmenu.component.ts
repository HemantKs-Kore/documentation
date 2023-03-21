import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostListener,
  Input,
  ViewChild,
  OnDestroy,
  EventEmitter,
  Output,
} from '@angular/core';
import { ActivatedRoute, Routes, Router } from '@angular/router';
import { Subscription, switchMap, tap, withLatestFrom } from 'rxjs';
import * as _ from 'underscore';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.apps/services/notification.service';
import { MixpanelServiceService } from '@kore.apps/services/mixpanel-service.service';
import { KRModalComponent } from '@kore.apps/shared/kr-modal/kr-modal.component';
import { SideBarService } from '@kore.apps/services/header.service';
import { ConfirmationDialogComponent } from '@kore.apps/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { PlanUpgradeComponent } from '../../../modules/pricing/shared/plan-upgrade/plan-upgrade.component';
import { DockStatusService } from '@kore.apps/services/dockstatusService/dock-status.service';
import { Store } from '@ngrx/store';
import {
  addIndexPipeline,
  addQueryPipeline,
  removeIndexPipeline,
  removeQueryPipeline,
  setIndexPipelineId,
  setQueryPipelineId,
  setQueryPipelines,
  updateIndexPipeline,
  updateQueryPipeline,
} from '@kore.apps/store/app.actions';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { KrModalModule } from '../../../shared/kr-modal/kr-modal.module';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { PlanUpgradeModule } from '@kore.apps/modules/pricing/shared/plan-upgrade/plan-upgrade.module';
import {
  selectIndexConfig,
  selectIndexPipelineId,
  selectIndexPipelines,
  selectQueryPipelines,
  selectSearchIndexId,
} from '@kore.apps/store/app.selectors';
declare const $: any;
@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainMenuComponent implements OnInit, OnDestroy {
  @Output() toggleMainMenu = new EventEmitter<void>();
  indexPipelineId;
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
    name: '',
  };
  newIndexConfigObj: any = {
    method: 'default',
    name: '',
  };
  searchPipeline: any = '';
  queryConfigsRouts: any = {
    '/synonyms': true,
    '/stopWords': true,
    '/weights': true,
    '/facets': true,
    '/resultranking': true,
    '/rules': true,
  };
  searchIndexId;
  selectedApp;
  usageDetails: any = {};
  configObj: any = {};
  selectedConfig: any = {};
  indexConfigObj: any = {};
  selectedIndexConfig: any = {};
  subscription: Subscription;
  indexSub: Subscription;
  queryConfigsSubscription: Subscription;
  editName = false;
  editNameVal = '';
  editIndexName = false;
  editIndexNameVal = '';
  submitted = false;
  showUpgrade = false;
  isRouteDisabled = false;
  public showStatusDocker = false;
  public statusDockerLoading = false;
  public dockersList: Array<any> = [];
  currentSubsciptionData: Subscription;
  updateUsageData: Subscription;
  componentType: any = '';
  currentSubscriptionPlan: any = {};
  @Input() show;
  @Input() settingMainMenu;
  @Input() sourceMenu;
  @ViewChild('addIndexFieldModalPop') addIndexFieldModalPop: KRModalComponent;
  @ViewChild('addFieldModalPop') addFieldModalPop: KRModalComponent;
  @ViewChild('statusDockerModalPop') statusDockerModalPop: KRModalComponent;
  @ViewChild('plans') plans: PlanUpgradeComponent;
  constructor(
    private service: ServiceInvokerService,
    private headerService: SideBarService,
    private workflowService: WorkflowService,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private notify: NotificationService,
    public appSelectionService: AppSelectionService,
    public dockService: DockStatusService,
    public dialog: MatDialog,
    public mixpanel: MixpanelServiceService,
    private store: Store
  ) {}
  goHome() {
    this.workflowService.selectedApp(null);
    this.router.navigate(['/apps'], { skipLocationChange: true });
  }
  preview(selection, route?) {
    const toogleObj = {
      title: selection,
    };
    this.headerService.toggle(toogleObj);
    if (
      selection == 'weights' ||
      selection == 'synonyms' ||
      selection == 'stopWords' ||
      selection == 'resultranking' ||
      selection == 'search-field-properties'
    ) {
      this.appSelectionService.updateTourConfig('configure');
    }
    if (
      selection == 'fields' ||
      selection == 'traits' ||
      selection == 'workbench'
    ) {
      this.appSelectionService.updateTourConfig('indexing');
    }
    if (['pricing', 'search_settings'].includes(route)) {
      const eventName =
        route === 'search_settings' ? 'Enter Weights' : 'Enter Plan Details';
      this.mixpanel.postEvent(eventName, {});
    }
  }
  //upgrade plan
  upgrade() {
    this.plans?.openSelectedPopup('choose_plan');
  }
  reloadCurrentRoute() {
    let route = '/summary';
    const previousState = this.appSelectionService.getPreviousState();
    if (previousState.route) {
      route = previousState.route;
    }
    try {
      if (route && this.queryConfigsRouts[route]) {
        if (
          this.workflowService.selectedApp() &&
          this.workflowService.selectedApp().searchIndexes &&
          this.workflowService.selectedApp().searchIndexes.length
        ) {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate([route], { skipLocationChange: true });
            });
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  showNotificationBanner(type) {
    const upgradeBtnTarget = $('.upgrade-plan-btn');
    if (upgradeBtnTarget.length) {
      const element = upgradeBtnTarget[0];
      const dimensions = element?.getClientRects();
      $('.hover-documnet-show-data').css({
        visibility: type === 'over' ? 'visible' : 'hidden',
        opacity: type === 'over' ? 1 : 0,
        top: dimensions[0]?.y - 64 + 'px',
      });
      if (type === 'over') this.appSelectionService.getCurrentUsage();
    }
  }
  selectDefault() {
    this.newConfigObj._id = this.selectedConfig;
  }
  editIndexConfig(config, action) {
    this.editIndexName = true;
    this.editIndexNameVal = config.name;
    this.selectIndexPipelineId(config, null, 'edit');
  }
  editConfig(config, action) {
    this.editName = true;
    this.editNameVal = config.name;
    this.selectQueryPipelineId(config, null, 'edit');
  }
  markAsDefaultIndex(config, action?) {
    this.editIndexName = false;
    const queryParms = {
      indexPipelineId: config._id,
      searchIndexId: this.searchIndexId,
    };
    let payload = {};
    if (action == 'edit') {
      payload = {
        name: this.editIndexNameVal,
      };
    } else {
      payload = {
        default: true,
      };
    }
    this.service.invoke('put.newIndexPipeline', queryParms, payload).subscribe(
      (res) => {
        this.store.dispatch(
          updateIndexPipeline({
            indexPipeline: res,
            isDefault: action !== 'edit',
          })
        );
        if (action === 'edit') {
          this.notify.notify(
            'Index congfiguration updated successfully',
            'success'
          );
        } else {
          this.notify.notify('Set to default Index successfully', 'success');
        }
        // this.indexPipelineService.updateOneInCache(res);
        // this.appSelectionService.getIndexPipelineIds(config);
        this.selectedIndexConfig = res;
        // this.appSelectionService.getIndexPipelineIds(config);
        // if (config && config._id && action !== 'edit') {
        //   this.selectQueryPipelineId(config);
        // }
        this.closeIndexModalPopup();
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to Create indexPipeline');
      }
    );
  }
  markAsDefault(config, action?) {
    this.editName = false;
    const queryParms = {
      queryPipelineId: config._id,
      searchIndexId: this.searchIndexId,
      indexPipelineId: this.indexPipelineId || '',
    };
    let payload = {};
    if (action == 'edit') {
      payload = {
        name: this.editNameVal,
      };
    } else {
      payload = {
        default: true,
      };
    }
    this.service.invoke('put.queryPipeline', queryParms, payload).subscribe(
      (res) => {
        this.store.dispatch(
          updateQueryPipeline({
            queryPipeline: res,
            isDefault: action !== 'edit',
          })
        );
        if (action == 'edit') {
          this.notify.notify(
            'Search congfiguration updated successfully',
            'success'
          );
        } else {
          this.notify.notify('Set to default successfully', 'success');
        }
        // this.appSelectionService.getQureryPipelineIds(config);
        if (config && config._id && action !== 'edit') {
          this.selectQueryPipelineId(config);
        }
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to set successfully');
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
      this.notify.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notify.notify(message, 'error');
    } else {
      this.notify.notify('Somthing went worng', 'error');
    }
  }

  validateIndexConfig() {
    if (this.newIndexConfigObj && this.newIndexConfigObj.name.length) {
      if (
        this.newIndexConfigObj.method === 'clone' &&
        this.newIndexConfigObj.index_config_name.length
      ) {
        this.submitted = false;
        return true;
      } else if (
        this.newIndexConfigObj.method === 'clone' &&
        !this.newIndexConfigObj.index_config_name.length
      ) {
        return false;
      } else {
        this.submitted = false;
        return true;
      }
    } else {
      return false;
    }
  }
  createIndexConfig() {
    this.submitted = true;
    if (this.validateIndexConfig()) {
      let payload: any = {
        method: this.newIndexConfigObj.method,
        name: this.newIndexConfigObj.name,
      };
      if (this.newIndexConfigObj.method === 'clone') {
        payload = {
          ...payload,
          sourceIndexPipelineId: this.newIndexConfigObj.index_config_id,
        };
      }
      const queryParms = {
        searchIndexId: this.searchIndexId,
      };
      this.service
        .invoke('post.newIndexPipeline', queryParms, payload)
        .subscribe(
          (res) => {
            this.store.dispatch(addIndexPipeline({ indexPipeline: res }));
            if (res && res._id) {
              // this.indexPipelineService.addOneToCache(res);
              if (this.newIndexConfigObj.method === 'clone') {
                this.notify.notify(
                  'New Index config cloned successfully',
                  'success'
                );
                this.mixpanel.postEvent('Index Created - Cloned', {});
              } else {
                this.notify.notify(
                  'New Index config created successfully',
                  'success'
                );
                this.mixpanel.postEvent('Index Created - New', {});
              }
              this.selectIndexPipelineId(res);
              /** appSelectedConfigs Subject is triggred to update SearchInterface Component
               *  the value will be passed to SearchInterface and will work smooth for default SearchInterface Component
               */
              //this.appSelectionService.appSelectedConfigs.next([res]);
              /** Calling for QuerryPipeline  */
              // this.queryConfigsSubscription = this.appSelectionService.queryConfigs.subscribe(res => {
              //   this.headerService.updateSearchConfiguration();
              // })
            }
            this.closeIndexModalPopup();
          },
          (errRes) => {
            if (
              errRes &&
              errRes.error &&
              errRes.error.errors[0].code == 'FeatureAccessLimitExceeded'
            ) {
              this.closeIndexModalPopup();
              this.errorToaster(errRes, errRes.error.errors[0].msg);
              this.upgrade();
            } else {
              this.errorToaster(errRes, 'Failed to Create indexPipeline');
            }
          }
        );
    } else {
      this.notify.notify('Enter the required fields to proceed', 'error');
    }
  }

  validateSearchConfig() {
    if (this.newConfigObj && this.newConfigObj.name.length) {
      if (
        this.newConfigObj.method === 'clone' &&
        this.newConfigObj.config_name.length
      ) {
        this.submitted = false;
        return true;
      } else if (
        this.newConfigObj.method === 'clone' &&
        !this.newConfigObj.config_name.length
      ) {
        return false;
      } else {
        this.submitted = false;
        return true;
      }
    } else {
      return false;
    }
  }
  createConfig() {
    this.submitted = true;
    if (this.validateSearchConfig()) {
      const payload: any = {
        method: this.newConfigObj.method,
        name: this.newConfigObj.name,
      };
      if (this.newConfigObj.method === 'clone') {
        payload.sourceQueryPipelineId = this.newConfigObj.config_id;
      }
      const queryParms = {
        searchIndexId: this.searchIndexId,
        indexPipelineId: this.indexPipelineId || '',
      };
      this.service
        .invoke('create.queryPipeline', queryParms, payload)
        // .pipe(switchMap(() => this.appSelectionService.getQureryPipelineIds()))
        .subscribe(
          (res) => {
            this.store.dispatch(addQueryPipeline({ queryPipeline: res }));
            if (res && res._id) {
              this.selectQueryPipelineId(res);
            }
            if (this.newConfigObj.method === 'clone') {
              this.notify.notify(
                'New Search config cloned successfully',
                'success'
              );
              this.mixpanel.postEvent('Search Config Created - Cloned', {});
            } else {
              this.notify.notify(
                'New Search config created successfully',
                'success'
              );
              this.mixpanel.postEvent('Search Config Created - New', {});
            }
            //this.headerService.updateSearchConfiguration();
            this.closeModalPopup();
          },
          (errRes) => {
            if (
              errRes &&
              errRes.error &&
              errRes.error.errors[0].code == 'FeatureAccessLimitExceeded'
            ) {
              this.closeModalPopup();
              this.errorToaster(errRes, errRes.error.errors[0].msg);
              this.upgrade();
            } else {
              this.errorToaster(errRes, 'Failed to Create searchconfig');
            }
          }
        );
    } else {
      this.notify.notify('Enter the required fields to proceed', 'error');
    }
  }
  selectQueryPipelineId(queryConfigs, event?, type?) {
    this.store.dispatch(
      setQueryPipelineId({ queryPipelineId: queryConfigs._id })
    );

    // console.log("queryConfigs", queryConfigs)
    if (event && !this.editName) {
      event.close();
    }
    if (this.editName && type) {
      this.editName = true;
    } else {
      this.editName = false;
      //event.close();
    }
    // this.appSelectionService.selectQueryConfig(queryConfigs);
    this.selectedConfig = queryConfigs;

    // this.reloadCurrentRoute();
  }
  deleteIndexPipeLine(indexConfigs, dialogRef, type) {
    let queryParms = {
      searchIndexId: this.searchIndexId,
      indexPipelineId:
        type == 'index' ? indexConfigs._id : this.indexPipelineId,
    };
    if (type == 'search') {
      queryParms = Object.assign(queryParms, {
        queryPIpelineId: indexConfigs._id,
      });
    }
    const url =
      type == 'index' ? 'delete.indexPipeline' : 'delete.queryPipeline';
    this.service.invoke(url, queryParms).subscribe(
      (res) => {
        dialogRef.close();
        const deleteIndex = _.findIndex(
          type == 'index' ? this.indexConfigs : this.queryConfigs,
          (pg) => {
            return pg._id === indexConfigs._id;
          }
        );
        if (type == 'index') {
          this.store.dispatch(
            removeIndexPipeline({ indexPipelineId: indexConfigs._id })
          );
          // this.indexPipelineService.removeOneFromCache(indexConfigs);
          // this.indexConfigs.splice(deleteIndex, 1);
          // const default_index = this.indexConfigs.filter(
          //   (item) => item.default == true
          // );
          // this.appSelectionService.getIndexPipelineIds(default_index);
        } else {
          this.store.dispatch(
            removeQueryPipeline({ queryPipelineId: indexConfigs._id })
          );
          // this.queryConfigs.splice(deleteIndex, 1);
          // this.appSelectionService.getQureryPipelineIds();
        }
        this.notify.notify('deleted successfully', 'success');
      },
      (errRes) => {
        this.errorToaster(errRes, 'Faile to delete.');
      }
    );
  }
  selectIndexPipelineId(indexConfigs, event?, type?) {
    this.store.dispatch(
      setIndexPipelineId({ indexPipelineId: indexConfigs._id })
    );

    if (event) {
      event.close();
    }
    if (this.editIndexName && type) {
      this.editIndexName = true;
    } else {
      this.editIndexName = false;
      //event.close();
    }
    //this.workflowService.selectedSearchIndex(indexConfigs._id)
    // this.appSelectionService.getIndexPipelineIds(indexConfigs);
    this.selectedIndexConfig = indexConfigs;
    //this.reloadCurrentRoute()
  }
  onKeypressEvent(e, config) {
    if (e) {
      e.stopPropagation();
    }
    if (e.keyCode == 13) {
      this.markAsDefault(config, 'edit');
      return false;
    }
  }
  onKeypressIndexEvent(e, config) {
    if (e) {
      e.stopPropagation();
    }
    if (e.keyCode == 13) {
      this.markAsDefaultIndex(config, 'edit');
      return false;
    }
  }
  async ngOnInit() {
    this.initAppIds();
    this.initPlanOnboadingModal();
    this.selectedApp = this.workflowService.selectedApp();
    this.currentSubscriptionPlan =
      this.appSelectionService?.currentsubscriptionPlanDetails;
    this.getSubscriptionData();
    this.currentSubsciptionData =
      this.appSelectionService.currentSubscription.subscribe((res) => {
        this.currentSubscriptionPlan = res;
        this.getSubscriptionData();
        this.isRouteDisabled = res?.appDisabled;
      });

    this.initIndexPipeLines();
    this.initQueryPipeLines();
    this.initIndexConfig();
    this.updateUsageData = this.appSelectionService.updateUsageData.subscribe(
      (res) => {
        if (res == 'updatedUsage') {
          this.usageDetails = this.appSelectionService?.currentUsageData;
        }
      }
    );
  }

  initAppIds() {
    const indexPipelineSub = this.store
      .select(selectIndexPipelineId)
      .pipe(
        withLatestFrom(
          this.store.select(selectSearchIndexId)
          // this.store.select(selectQueryPipelineId)
        ),
        tap(([indexPipelineId, searchIndexId]) => {
          this.searchIndexId = searchIndexId;
          this.indexPipelineId = indexPipelineId;
          // this.loadFiledsData();
        })
      )
      .subscribe();

    this.subscription?.add(indexPipelineSub);
  }

  initIndexConfig() {
    const indexSub = this.store.select(selectIndexConfig).subscribe((res) => {
      this.selectedIndexConfig = res;
    });

    this.subscription?.add(indexSub);
  }

  initIndexPipeLines() {
    this.subscription = this.store
      .select(selectIndexPipelines)
      .subscribe((res) => {
        this.indexConfigs = JSON.parse(JSON.stringify(res));

        // if (res.length > 0) {
        //   this.selectedIndexConfig = this.indexConfigs.find(
        //     (item) => item.default
        //   );
        // }
      });
  }

  initQueryPipeLines() {
    this.subscription = this.store
      .select(selectQueryPipelines)
      .subscribe((res) => {
        this.queryConfigs = JSON.parse(JSON.stringify(res));
        // res.forEach((element) => {
        //   this.configObj[element._id] = element;
        // });
        this.selectedConfig = this.queryConfigs.find((item) => item.default);

        // setTimeout(() => {
        //   this.selectedApp = this.workflowService.selectedApp();
        //   if (this.selectedApp?.searchIndexes?.length) {
        //     this.searchIndexId = this.selectedApp?.searchIndexes[0]._id;
        //   }
        // }, 1000);

        // this.indexConfigs = JSON.parse(JSON.stringify(res));
        // this.indexConfigs.forEach((element) => {
        //   this.indexConfigObj[element._id] = element;
        // });

        // if (res.length > 0) {
        //   this.selectedIndexConfig = this.indexConfigs.find(
        //     (item) => item.default
        //   );
        // }
      });
  }

  initPlanOnboadingModal() {
    const planOnboardingModalSubscription =
      this.appSelectionService.openPlanOnboardingModal.subscribe((res) => {
        this.openPlanOnboadingModal();
      });

    this.subscription?.add(planOnboardingModalSubscription);
  }

  //open landing page onboarding journy popup from plan-upgrade component
  openPlanOnboadingModal() {
    this.plans?.openSelectedPopup('onboardingJourny');
  }

  //check subscription data
  getSubscriptionData() {
    if (this.currentSubscriptionPlan?.subscription) {
      this.showUpgrade = ['Unlimited', 'Enterprise'].includes(
        this.currentSubscriptionPlan?.subscription?.planName
      )
        ? false
        : true;
    }
  }

  // toggle sub-menu
  switchToTerminal() {
    this.closeModalPopup();
  }
  toggleTranningMenu() {
    this.trainingMenu === false
      ? (this.trainingMenu = true)
      : (this.trainingMenu = false);
  }
  closeModalPopup() {
    this.submitted = false;
    this.addFieldModalPopRef.close();
    this.newConfigObj = {
      method: 'default',
      name: '',
      config_name: '',
      config_id: '',
    };
  }
  closeIndexModalPopup() {
    this.submitted = false;
    this.addIndexFieldModalPopRef
      ? this.addIndexFieldModalPopRef.close()
      : null;
    this.newIndexConfigObj = {
      method: 'default',
      name: '',
      index_config_name: '',
      index_config_id: '',
    };
  }
  openModalPopup(type, config) {
    this.newConfigObj = {
      method: type,
      name: '',
      config_name: config !== undefined ? config.name : '',
      config_id: config !== undefined ? config._id : '',
    };
    this.submitted = false;
    this.addFieldModalPopRef = this.addFieldModalPop.open();
    setTimeout(() => {
      $('#createQueryConfig').blur();
    }, 100);
  }
  openIndexModalPopup(type, config) {
    this.newIndexConfigObj = {
      method: type,
      name: '',
      index_config_name: config !== undefined ? config.name : '',
      index_config_id: config !== undefined ? config._id : '',
    };
    this.submitted = false;
    this.addIndexFieldModalPopRef = this.addIndexFieldModalPop.open();
    setTimeout(() => {
      $('#createIndexConfig').blur();
    }, 100);
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
      searchIndexId: this.searchIndexId,
    };
    this.service.invoke('get.dockStatus', queryParms).subscribe(
      (res) => {
        this.statusDockerLoading = false;
        /**made changes on 24/02 as per new api contract in response we no longer use the key
         dockStatuses added updated code in 576 line*/
        // this.dockersList = res.dockStatuses;
        this.dockersList = res;
      },
      (errRes) => {
        this.statusDockerLoading = false;
        this.errorToaster(errRes, 'Failed to get Status of Docker.');
      }
    );
  }
  checkExistInExperiment(config, type) {
    const queryParms = {
      searchIndexId: this.searchIndexId,
      indexPipelineId: type == 'index' ? config._id : this.indexPipelineId,
    };
    this.service.invoke('get.checkInExperiment', queryParms).subscribe(
      (res) => {
        const text = res.validated
          ? `Selected ${
              type == 'index' ? 'Index' : 'Search'
            } Configuration will be deleted from the app.`
          : `Selected ${
              type == 'index' ? 'Index' : 'Search'
            } Configuration is being used in Experiments. Deleting it stop the Experiement.`;
        this.deleteIndexConfig(config, type, text, res.validated);
      },
      (errRes) => {
        this.errorToaster(errRes, 'Failed to get API Response');
      }
    );
  }
  deleteIndexConfig(config, type, text, validated) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete ?',
        body: text,
        buttons: [
          {
            key: 'yes',
            label: `${validated ? 'Delete' : 'Delete Anyway'}`,
            type: 'danger',
          },
          { key: 'no', label: 'Cancel' },
        ],
        confirmationPopUp: true,
      },
    });

    dialogRef.componentInstance.onSelect.subscribe((result) => {
      if (result === 'yes') {
        this.deleteIndexPipeLine(config, dialogRef, type);
      } else if (result === 'no') {
        dialogRef.close();
      }
    });
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
    this.currentSubsciptionData
      ? this.currentSubsciptionData.unsubscribe()
      : false;
    this.updateUsageData ? this.updateUsageData.unsubscribe() : false;
    this.queryConfigsSubscription
      ? this.queryConfigsSubscription.unsubscribe()
      : false;
  }
}

@NgModule({
  declarations: [MainMenuComponent, ConfirmationDialogComponent],
  imports: [
    CommonModule,
    KrModalModule,
    PerfectScrollbarModule,
    TranslateModule,
    FormsModule,
    RouterModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    SharedPipesModule,
    MatDialogModule,
    PlanUpgradeModule,
    NgOptimizedImage,
  ],
  entryComponents: [ConfirmationDialogComponent],
  exports: [MainMenuComponent],
})
export class MainMenuModule {}
