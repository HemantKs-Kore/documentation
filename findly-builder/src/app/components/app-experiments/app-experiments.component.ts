import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'underscore';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-app-experiments',
  templateUrl: './app-experiments.component.html',
  styleUrls: ['./app-experiments.component.scss']
})
export class AppExperimentsComponent implements OnInit {
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
  showSlider: boolean = false;
  public someRangeconfig: any = {
    behaviour: "drag",
    connect: this.conn,
    tooltips: this.tool,
    start: this.star,
    format: {
      from: function (value) {
        return parseInt(value);
      },
      to: function (value) {
        return parseInt(value);
      }
    },
    range: {
      min: 0,
      max: 100
    }
  };
  @ViewChild('addExperiments') addExperiments: KRModalComponent;
  @ViewChild("sliderref") sliderref;
  variantList = [{ color: '#ff0000', code: 'A' }, { color: '#0000ff', code: 'B' }, { color: '#8cff1a', code: 'C' }, { color: '#ffff00', code: 'D' }];
  constructor(public workflowService: WorkflowService, private service: ServiceInvokerService, private notificationService: NotificationService, public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getExperiments();
    this.getQueryPipeline();
  }
  //close model popup method
  closeModalPopup() {
    this.showSlider = false;
    this.star = [100];
    if (this.conn.length > 1) {
      for (let i = 0; i < this.conn.length; i++) {
        if (this.conn.length > 2) {
          this.conn.pop();
          this.tool.pop();
        }
      }
    }
    this.someRangeconfig = { ...this.someRangeconfig, start: this.star, conn: this.conn, tool: this.tool };
    this.variantsArray = [];
    this.experimentObj = { name: '', variants: [], duration: { days: 0 } };
    this.addExperimentsRef.close();
  }
  //traffic slider config object
  sliderConfig() {
    this.conn = [true, true];
    this.tool = [true];
    this.star = [100];
  }
  //show or hide search input
  toggleSearch() {
    if (this.showSearch && this.searchFields) {
      this.searchFields = '';
    }
    this.showSearch = !this.showSearch
  }
  //add Experiment
  form_type;
  exp_id;
  addExperiment(type, data) {
    console.log("type", type, data);
    this.form_type = type;
    if (type === 'edit') {
      this.exp_id = data._id;
      this.experimentObj.name = data.name;
      this.variantsArray = data.variants;
      this.experimentObj.duration.days = data.duration.days;
      this.showSlider = true;
    }
    this.addExperimentsRef = this.addExperiments.open();
    console.log("experimentObj", this.experimentObj)
  }
  //add variant dynamically
  trafficData: any = [];
  addVarient() {
    if (this.variantsArray.length <= 3) {
      this.variantsArray.push(this.variantList[this.variantsArray.length]);
      let length = this.variantsArray.length;
      this.showTraffic(length, 'add');
      this.showSliderPercentage(length);
    }
  }
  //based on variant show traffic 
  showTraffic(length, type) {
    console.log("len", length);
    if (length > 1) {
      this.star = [];
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
      this.sliderConfig();
    }
    else if (length === 1) {
      if (type === 'add') {
        this.showSlider = true;
      }
      else {
        this.star = [];
        this.conn.pop();
        this.tool.pop();
        this.star.push(100);
        this.sliderUpdate();
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
    if (length > 1) {
      this.sliderUpdate();
    }
  }
  //slider destroy method
  sliderUpdate() {
    this.someRangeconfig = { ...this.someRangeconfig, start: this.star };
    setTimeout(() => {
      this.showSlider = false;
      this.sliderref.slider.destroy();
      this.sliderref.slider.updateOptions(this.someRangeconfig, true);
    }, 1000)
    setTimeout(() => {
      this.showSlider = true;
    }, 2000);
  }
  //fetch variant data
  fetchVariant(index, data, type) {
    console.log("data", data)
    if (type === 'name') {
      this.variantsArray[index] = { ...this.variantsArray[index], name: data };
    }
    else if (type === 'queryid') {
      this.variantsArray[index] = { ...this.variantsArray[index], queryPipelineId: data._id, queryPipelineName: data.name };
    }
    console.log("this.variant", this.variantsArray);
  }
  //remove variant
  removeVariant(index) {
    this.variantsArray.splice(index, 1);
    console.log("this.variantArray", this.variantsArray);
    this.trafficData.splice(index, 1);
    this.showTraffic(this.variantsArray.length, 'remove');
    this.showSliderPercentage(this.variantsArray.length);
  }
  //slider changed
  sliderChanged() {
    console.log("slider changed", this.someRange);
    this.sliderPercentage();
  }
  //show slider percentage
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
      setPercent = [30, 60, 10];
    }
    else if (length === 4) {
      setPercent = [25, 25, 25, 25];
    }
    for (let i = 0; i < this.variantsArray.length; i++) {
      this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: setPercent[i] };
    }
  }
  //get list of querypipelines method
  queryPipeline: any = [];
  getQueryPipeline() {
    const header: any = {
      'x-timezone-offset': '-330'
    };
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
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
  //get list of experiments method
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
  getExperiments() {
    this.loadingContent = true;
    const header: any = {
      'x-timezone-offset': '-330'
    };
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      offset: 0,
      limit: 100,
      state: 'all'
    };
    this.service.invoke('get.experiment', quaryparms, header).subscribe(res => {
      let date1: any = new Date();
      const result = res.map(data => {
        let date2: any = new Date(data.end);
        let sub = Math.abs(date1 - date2) / 1000;
        let days = Math.floor(sub / 86400);
        let obj = Object.assign({}, data);
        obj.date_days = days;
        return obj;
      })
      this.listOfExperiments = result;
      this.filterExperiments = result;
      console.log("res new", this.listOfExperiments)
      this.status_active = res.filter(item => item.state === 'active').length >= 1 ? true : false;
      this.allExp = this.listOfExperiments.length;
      this.confExp = this.listOfExperiments.filter(item => item.state === "configured").length;
      this.actExp = this.listOfExperiments.filter(item => item.state === "active").length;
      this.pauExp = this.listOfExperiments.filter(item => item.state === "paused").length;
      this.compExp = this.listOfExperiments.filter(item => item.state === "completed").length;
      this.loadingContent = false;
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
  }
  //add new experiment method
  async createExperiment() {
    if (this.someRange !== undefined) {
      await this.sliderPercentage();
    }
    console.log("add experiment", this.experimentObj);
    // this.experimentObj.variants = this.variantsArray;
    // if (this.form_type === 'add') {
    //   const quaryparms: any = {
    //     searchIndexId: this.serachIndexId
    //   };
    //   this.service.invoke('create.experiment', quaryparms, this.experimentObj).subscribe(res => {
    //     console.log("add res", res);
    //     this.closeModalPopup();
    //     this.getExperiments();
    //     this.notificationService.notify('Experiment added successfully', 'success');
    //   }, errRes => {
    //     if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
    //       this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    //     } else {
    //       this.notificationService.notify('Failed ', 'error');
    //     }
    //   });
    // }
    // else {
    //   const quaryparms: any = {
    //     searchIndexId: this.serachIndexId,
    //     experimentId: this.exp_id
    //   };
    //   this.service.invoke('edit.experiment', quaryparms, this.experimentObj).subscribe(res => {
    //     console.log("add res", res);
    //     this.closeModalPopup();
    //     this.getExperiments();
    //     this.notificationService.notify('Experiment Updated successfully', 'success');
    //   }, errRes => {
    //     if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
    //       this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    //     } else {
    //       this.notificationService.notify('Failed ', 'error');
    //     }
    //   });
    // }
  }
  //change traffic percentage based on slider
  sliderPercentage() {
    if (this.variantsArray.length === 1) {
      for (let i in this.variantsArray) {
        this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: 100 }
      }
    }
    if (this.variantsArray.length === 2) {
      for (let i = 0; i < this.variantsArray.length; i++) {
        if (i == 0) {
          this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: this.someRange[0] }
        }
        else {
          this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: 100 - this.someRange[0] }
        }
      }
    }
    if (this.variantsArray.length === 3) {
      for (let i = 0; i < this.variantsArray.length; i++) {
        if (i == 0) {
          this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: this.someRange[0] }
        }
        else if (i == 1) {
          let sum = this.someRange[1] - this.someRange[0];
          this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: sum }
        }
        else if (i == 2) {
          let sum = this.someRange[0] + (this.someRange[1] - this.someRange[0]);
          this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: 100 - Math.abs(sum) }
        }
      }
    }
    if (this.variantsArray.length === 4) {
      for (let i = 0; i < this.variantsArray.length; i++) {
        if (i == 0) {
          this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: this.someRange[0] }
        }
        else if (i == 1) {
          this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: this.someRange[1] - this.someRange[0] }
        }
        else if (i == 2) {
          let sum =
            this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: this.someRange[2] - this.someRange[1] }
        }
        else if (i == 3) {
          let sum = this.someRange[0] + (this.someRange[1] - this.someRange[0]) + (this.someRange[2] - this.someRange[1]);
          this.variantsArray[i] = { ...this.variantsArray[i], trafficPct: 100 - sum }
        }
      }
    }
  }
  //run an experiment
  runExperiment(id, status, event) {
    event.stopPropagation();
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      experimentId: id
    };
    const Obj = { "state": status }
    this.service.invoke('edit.experiment', quaryparms, Obj).subscribe(res => {
      console.log("run res", res);
      this.notificationService.notify('Experiment Running successfully', 'success');
      this.getExperiments();
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
  }
  //delete experiment popup
  deleteExperimentPopup(record, event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Experiment',
        text: 'Are you sure you want to delete selected Experiment?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.deleteExperiment(record, dialogRef);
        } else if (result === 'no') {
          dialogRef.close();
          console.log('deleted')
        }
      })
  }
  //delete experiment
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
      this.notificationService.notify('Experiment Deleted successfully', 'success');
    }, errRes => {
      if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      } else {
        this.notificationService.notify('Failed ', 'error');
      }
    });
  }
  //filter list using tabs
  setTab: string = 'all';
  selectedTab(type) {
    let filterArray: any = this.filterExperiments;
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
    else if (type === 'completed') {
      this.listOfExperiments = filterArray.filter(item => item.state === 'completed');
    }
  }
}
