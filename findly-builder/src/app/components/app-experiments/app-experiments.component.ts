import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service'
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'underscore';
import * as moment from 'moment';
declare const $: any;
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-app-experiments',
  templateUrl: './app-experiments.component.html',
  styleUrls: ['./app-experiments.component.scss']
})
export class AppExperimentsComponent implements OnInit {
  constructor(public workflowService: WorkflowService, private service: ServiceInvokerService, private notificationService: NotificationService, public dialog: MatDialog, private appSelectionService: AppSelectionService) { }
  addExperimentsRef: any;
  selectedApp: any;
  serachIndexId: any;
  showSearch;
  select_config: any;
  searchFields: any = '';
  variantsArray: any = [];
  experimentObj: any = {
    name: '',
    variants: this.variantsArray,
    duration: { days: 0 }
  }
  conn: any = [true, true];
  tool: any = [true];
  star: any = [100];
  someRange: any;
  showSlider = false;
  someRangeconfig: any = null;
  @ViewChild('addExperiments') addExperiments: KRModalComponent;
  @ViewChild('sliderref') sliderref;
  variantList = [{ color: '#ff0000', code: 'A' }, { color: '#0000ff', code: 'B' }, { color: '#8cff1a', code: 'C' }, { color: '#ffff00', code: 'D' }];
  // add Experiment
  form_type;
  exp_id;
  exp_status: string;
  trafficData: any = [];
  queryPipeline: any = [];
  indexConfig: any = [];
  listOfExperiments: any = [];
  filterExperiments: any = [];
  allExp: number;
  confExp: number;
  actExp: number;
  pauExp: number;
  compExp: number;
  loadingContent: boolean;
  res1 = [];
  status_active: boolean;
  // filter list using tabs
  setTab = 'all';
  exp_totalRecord: number;
  exp_limitPage: number = 10;
  exp_skipPage: number = 0;
  test = 33.33;
  loadingContent1: boolean;
  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getExperiments();
    this.setSliderDefaults();
    this.getIndexPipeline();
  }
  loadImageText: boolean = false;
  imageLoaded() {
    this.loadingContent = false;
    this.loadingContent1 = true;
    this.loadImageText = true;
  }
  setSliderDefaults(starts?) {
    starts = starts || [...this.star];
    this.someRangeconfig = {
      behaviour: 'drag',
      connect: [...this.conn],
      tooltips: [...this.tool],
      start: starts,
      step: 5,
      format: {
        from: (value) => {
          return parseInt(value, 10);
        },
        to: (value) => {
          return parseInt(value, 10);
        }
      },
      range: {
        min: 0,
        '5%': 5, '10%': 10, '15%': 15, '20%': 20, '25%': 25, '30%': 30, '35%': 35,
        '40%': 40, '45%': 45, '50%': 50, '55%': 55, '60%': 60, '65%': 65, '70%': 70,
        '75%': 75, '80%': 80, '85%': 85, '90%': 90, '95%': 95,
        max: 100
      },
      snap: true,
    };
    this.updateSliderConfig();
  }

  // close model popup method
  closeModalPopup() {
    this.exp_status = '';
    this.form_type = '';
    this.variantsArray = [];
    this.experimentObj = { name: '', variants: [], duration: { days: 0 } };
    this.updateSliderConfig(true);
    this.showSlider = false;
    this.someRangeconfig = null;
    this.setSliderDefaults();
    this.addExperimentsRef.close();
  }
  // show or hide search input
  toggleSearch() {
    if (this.showSearch && this.searchFields) {
      this.searchFields = '';
    }
    this.showSearch = !this.showSearch
  }
  updateSliderConnects() {
    const connects: any = [true];
    this.someRangeconfig.start.forEach(element => {
      connects.push(true);
    });
    this.someRangeconfig.connect = connects;
  }
  updateSliderTooltips() {
    const tooltips: any = [];
    this.someRangeconfig.start.forEach(element => {
      tooltips.push(true);
    });
    this.someRangeconfig.tooltips = tooltips;
  }
  updateSlderModel() {
    this.someRange = this.someRangeconfig.start;
  }
  updateAllSliderConfigs() {
    this.updateSliderConnects();
    this.updateSliderTooltips();
    this.updateSlderModel();
  }
  updateSliderConfig(destroy?) {
    this.updateAllSliderConfigs();
    if (this.sliderref && this.sliderref.slider) {
      this.sliderref.slider.destroy();
    }
    if (this.sliderref && this.sliderref.slider) {
      this.sliderref.slider.updateOptions(this.someRangeconfig, true);
    }
  }
  addExperiment(type, data) {
    this.form_type = type;
    if (type === 'edit') {
      this.showSlider = false;
      this.exp_id = data._id;
      this.exp_status = data.state;
      this.experimentObj.name = data.name;
      this.variantsArray = JSON.parse(JSON.stringify(data.variants));
      this.experimentObj.duration.days = data.duration.days;
      this.setSliderDefaults();
      this.showTraffic(this.variantsArray.length, 'add');
    }
    else {
      this.showSlider = false;
      this.addVarient(2);
    }
    this.addExperimentsRef = this.addExperiments.open();
  }
  addVarient(count?) {
    if (this.variantsArray.length <= 3) {
      this.showSlider = false;
      if (count) {
        for (let i = 0; i < count; i++) {
          if (this.variantsArray.length <= 3) {
            this.variantsArray.push(this.variantList[this.variantsArray.length]);
          }
        }
      } else {
        this.variantsArray.push(this.variantList[this.variantsArray.length]);
      }
      const length = this.variantsArray.length;
      this.showTraffic(length, 'add');
      this.showSliderPercentage(length);
    }
  }
  // based on variant show traffic
  showTraffic(length, type) {

    this.star = [];
    if (length > 1) {
      if (type === 'add') {
        this.conn.push(true);
        this.tool.push(true);
      }
      else if (type === 'remove') {
        this.conn.pop();
        this.tool.pop();
      }
    }
    if (length === 0) {
      this.showSlider = false;
    }
    else if (length === 1) {
      if (type === 'add') {
        this.star.push(100);
      }
      else if (type === 'remove') {
        this.conn.pop();
        this.tool.pop();
        this.star.push(100);
      }
    }
    else if (length === 2) {
      this.star.push(50, 100);
    }
    else if (length === 3) {
      this.star.push(30, 60, 100);
    }
    else if (length === 4) {
      this.star.push(25, 50, 75, 100);
    }
    setTimeout(() => {
      this.showSlider = false;
      this.sliderUpdate();
    }, 500);
  }
  // slider destroy method
  sliderUpdate() {
    this.someRangeconfig.start = [...this.star];
    this.updateSliderConnects();
    this.updateSliderTooltips();
    setTimeout(() => {
      this.showSlider = false;
      this.updateSliderConfig();
    })
    setTimeout(() => {
      this.updateAllSliderConfigs();
      this.showSlider = true;
      this.recheckSliderDrag();
    }, 50);
  }
  // fetch variant data
  fetchVariant(index, data, type) {
    if (type === 'name') {
      this.variantsArray[index] = { ...this.variantsArray[index], name: data };
    }
    else if (type === 'queryid') {
      this.variantsArray[index] = { ...this.variantsArray[index], queryPipelineId: data._id, queryPipelineName: data.name };
    }
    else if (type === 'indexid') {
      this.variantsArray[index] = { ...this.variantsArray[index], indexPipelineId: data._id, indexPipelineName: data.name };
    }
  }
  // remove variant
  removeVariant(index) {
    this.variantsArray.splice(index, 1);
    this.trafficData.splice(index, 1);
    this.showTraffic(this.variantsArray.length, 'remove');
    this.showSliderPercentage(this.variantsArray.length);
  }
  // slider changed
  sliderChanged() {
    this.sliderPercentage();
    this.recheckSliderDrag();
  }
  // show slider percentage
  showSliderPercentage(length) {
    let setPercent = [];
    this.trafficData = [];
    if (length === 1) {
      setPercent = [100];
    }
    else if (length === 2) {
      setPercent = [50, 50];
    }
    else if (length === 3) {
      setPercent = [30, 30, 40];
    }
    else if (length === 4) {
      setPercent = [25, 25, 25, 25];
    }
    for (let i = 0; i < this.variantsArray.length; i++) {
      this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: setPercent[i] };
    }
  }
  recheckSliderDrag() {
    // disables the right most handel to drag.
    setTimeout(() => {
      const elements = document.getElementsByClassName('noUi-tooltip');

      if (elements.length) {
        for (let i = 0; i < elements.length; i++) {
          elements[i].innerHTML = this.variantsArray[i].trafficPct + '%';
        }
      }

      const origins = document.getElementsByClassName('noUi-origin');
      if (origins.length) {
        origins[origins.length - 1].setAttribute('disabled', 'true');
      }

      const classes = ['c-1-color', 'c-2-color', 'c-3-color', 'c-4-color', 'c-5-color'];

      const connect = document.querySelectorAll('.noUi-connect');
      if (connect.length) {
        for (let i = 0; i < connect.length; i++) {
          connect[i].classList.add(classes[i]);
        }
      }
    }, 50);
  }
  getIndexPipeline() {
    const header: any = {
      'x-timezone-offset': '-330'
    };
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      offset: 0,
      limit: 100
    };
    this.service.invoke('get.indexPipeline', quaryparms, header).subscribe(res => {
      console.log("get.indexPipeline", res)
      this.indexConfig = res;
      this.getQueryPipeline(res[0]._id);
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
  }
  getQueryPipeline(id) {
    const header: any = {
      'x-timezone-offset': '-330'
    };
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      indexPipelineId: id,
      offset: 0,
      limit: 100
    };
    this.service.invoke('get.queryPipelines', quaryparms, header).subscribe(res => {
      this.queryPipeline = res;
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
  }

  getExperiments() {
    this.loadingContent = true;
    const header: any = {
      'x-timezone-offset': '-330'
    };
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      offset: this.exp_skipPage,
      limit: this.exp_limitPage,
      state: 'all'
    };
    this.service.invoke('get.experiment', quaryparms, header).subscribe(res => {
      const date1: any = new Date();
      this.exp_totalRecord = res.total;
      const result = res.experiments.map(data => {
        let hours = moment().diff(moment(data.end), 'hours');
        let days = moment().diff(moment(data.end), 'days');
        let days_result = Math.abs(hours) > 24 ? Math.abs(days) + ' days' : Math.abs(hours) + ' hrs';
        let res_obj = data.variants.reduce((p, c) => p.ctr > c.ctr ? p : c);
        return { ...data, total_days: days_result, time_result: Math.abs(hours), top_leader: res_obj.code };
      });
      this.listOfExperiments = result;
      this.filterExperiments = result;
      this.statusList(result);
      this.countExperiment(result);
      if (result.length > 0) {
        this.loadingContent = false;
        this.loadingContent1 = true;
      }
      else {
        this.loadingContent1 = true;
      }
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
  }
  //dynamically show status
  dynamicStatus: any = [];
  statusList(result) {
    this.dynamicStatus = new Set();
    this.dynamicStatus.add("all");
    for (let i in result) {
      this.dynamicStatus.add(result[i].state)
    }
  }
  // filter count of list of experiments
  countExperiment(res) {
    this.status_active = res.filter(item => item.state === 'active').length >= 1 ? true : false;
    this.allExp = res.length;
    this.confExp = res.filter(item => item.state === 'configured').length;
    this.actExp = res.filter(item => item.state === 'active').length;
    this.pauExp = res.filter(item => item.state === 'paused').length;
    this.compExp = res.filter(item => item.state === 'completed').length;
  }
  // add new experiment method
  async createExperiment() {
    if (this.variantsArray[0].indexPipelineId === undefined) {
      this.variantsArray[0] = { ...this.variantsArray[0], indexPipelineId: this.indexConfig[0]._id, queryPipelineId: this.queryPipeline[0]._id };
    }
    if (this.someRange !== undefined) {
      await this.sliderPercentage();
    }
    this.experimentObj.variants = this.variantsArray;
    if (this.form_type === 'add') {
      const quaryparms: any = {
        searchIndexId: this.serachIndexId
      };
      this.service.invoke('create.experiment', quaryparms, this.experimentObj).subscribe(res => {
        this.filterExperiments.push(res);
        this.countExperiment(this.filterExperiments);
        this.selectedTab(this.setTab);
        this.closeModalPopup();
        this.notificationService.notify('Added Successfully', 'success');
      }, errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      });
    }
    else {
      const quaryparms: any = {
        searchIndexId: this.serachIndexId,
        experimentId: this.exp_id
      };
      this.service.invoke('edit.experiment', quaryparms, this.experimentObj).subscribe(res => {
        this.closeModalPopup();
        this.filterExperiments = this.filterExperiments.map(item => {
          if (item._id === this.exp_id) {
            return { ...res, date_days: item.date_days }
          }
          else {
            return item
          }
        })
        this.listOfExperiments = this.filterExperiments;
        this.notificationService.notify('Updated Successfully', 'success');
      }, errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      });
    }
  }
  // change traffic percentage based on slider
  sliderPercentage() {
    if (this.variantsArray.length === 1) {
      // tslint:disable-next-line:forin
      for (const i in this.variantsArray) {
        this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: 100 }
      }
    }
    if (this.variantsArray.length === 2) {
      for (let i = 0; i < this.variantsArray.length; i++) {
        if (i === 0) {
          this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: this.someRange[0] }
        }
        else {
          this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: 100 - this.someRange[0] }
        }
      }
    }
    if (this.variantsArray.length === 3) {
      for (let i = 0; i < this.variantsArray.length; i++) {
        if (i === 0) {
          this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: this.someRange[0] }
        }
        else if (i === 1) {
          const sum = this.someRange[1] - this.someRange[0];
          this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: sum }
        }
        else if (i === 2) {
          const sum = this.someRange[0] + (this.someRange[1] - this.someRange[0]);
          this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: 100 - sum }
        }
      }
    }
    if (this.variantsArray.length === 4) {
      for (let i = 0; i < this.variantsArray.length; i++) {
        if (i === 0) {
          this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: this.someRange[0] }
        }
        else if (i === 1) {
          this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: this.someRange[1] - this.someRange[0] }
        }
        else if (i === 2) {
          const sum =
            this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: this.someRange[2] - this.someRange[1] }
        }
        else if (i === 3) {
          const sum = this.someRange[0] + (this.someRange[1] - this.someRange[0]) + (this.someRange[2] - this.someRange[1]);
          this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: 100 - sum }
        }
      }
    }
  }
  // run an experiment
  runExperiment(id, status, event) {
    event.stopPropagation();
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      experimentId: id
    };
    const Obj = { state: status }
    this.service.invoke('edit.experiment', quaryparms, Obj).subscribe(res => {
      this.filterExperiments = this.filterExperiments.map(item => {
        if (item._id === id) {
          if (status === 'active') {
            return res
          }
          else {
            return { ...item, state: status }
          }
        }
        else {
          return item
        }
      })
      if (status === 'active') {
        this.filterExperiments = this.filterExperiments.map(data => {
          let hours = moment().diff(moment(data.end), 'hours');
          let days = moment().diff(moment(data.end), 'days');
          console.log("hours", hours, "days", days)
          let days_result = Math.abs(hours) > 24 ? Math.abs(days) + ' days' : Math.abs(hours) + ' hrs';
          return { ...data, total_days: days_result, time_result: Math.abs(hours) };
        })
      }
      this.listOfExperiments = this.filterExperiments;
      this.countExperiment(this.listOfExperiments);
      this.selectedTab(this.setTab);
      this.statusList(this.listOfExperiments);
      this.notificationService.notify(`Experiment ${status} `, 'success');
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
  }
  // delete experiment popup
  deleteExperimentPopup(record, event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to delete?',
        body: 'Selected Experiment will be permanently deleted.',
        buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
        confirmationPopUp: true
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.deleteExperiment(record, dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
        }
      })
  }
  // delete experiment
  deleteExperiment(id, dialogRef) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      experimentId: id
    };
    this.service.invoke('delete.experiment', quaryparms).subscribe(res => {
      const deleteIndex = _.findIndex(this.listOfExperiments, (pg) => {
        return pg._id === id;
      })
      this.listOfExperiments.splice(deleteIndex, 1);
      dialogRef.close();
      this.notificationService.notify('Deleted Successfully', 'success');
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
  }
  selectedTab(type) {
    const filterArray: any = this.filterExperiments;
    this.setTab = type;
    if (type === 'all') {
      this.listOfExperiments = this.filterExperiments;
    }
    else if (type === 'configured') {
      this.listOfExperiments = filterArray.filter(item => item.state === 'configured');
    }
    else if (type === 'active') {
      this.listOfExperiments = filterArray.filter(item => item.state === 'active');
    }
    else if (type === 'paused') {
      this.listOfExperiments = filterArray.filter(item => item.state === 'paused');
    }
    else if (type === 'stopped') {
      this.listOfExperiments = filterArray.filter(item => item.state === 'stopped');
    }
    else if (type === 'completed') {
      this.listOfExperiments = filterArray.filter(item => item.state === 'completed');
    }
  }
  //pagination for list
  paginate(event) {
    this.exp_limitPage = event.limit;
    this.exp_skipPage = event.skip;
    this.getExperiments();
  }
  //show or hide sort icon
  selectedSort = '';
  isAsc = true;
  getSortIconVisibility(sortingField: string, type: string) {
    switch (this.selectedSort) {
      case "name": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      case "state": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
      case "duration": {
        if (this.selectedSort == sortingField) {
          if (this.isAsc == false && type == 'down') {
            return "display-block";
          }
          if (this.isAsc == true && type == 'up') {
            return "display-block";
          }
          return "display-none"
        }
      }
    }
  }
  //all fields sort by respective click
  sortBy(sort) {
    const data = this.listOfExperiments.slice();
    this.selectedSort = sort;
    if (this.selectedSort !== sort) {
      this.isAsc = true;
    } else {
      this.isAsc = !this.isAsc;
    }
    const sortedData = data.sort((a, b) => {
      const isAsc = this.isAsc;
      switch (sort) {
        case 'state': return this.compare(a.state, b.state, isAsc);
        default: return 0;
      }
    });
    this.listOfExperiments = sortedData;
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
