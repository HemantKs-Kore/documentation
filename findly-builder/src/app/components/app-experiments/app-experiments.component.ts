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
  searchFields: any = '';
  experiment: any = {
    name: '',
    variants: [],
    duration: 0
  }
  conn: any = [true];
  tool: any = [];
  star: any = [100];
  flag: boolean = false;
  someRange;
  showSlider: boolean = false;
  public someRangeconfig: any = {
    behaviour: "drag",
    connect: this.conn,
    tooltips: this.tool,
    start: this.star,
    range: {
      min: 0,
      max: 100
    }
  };
  @ViewChild('addExperiments') addExperiments: KRModalComponent;
  @ViewChild("sliderref") sliderref;
  varients = [{ color: '#ff0000', code: 'A' }, { color: '#0000ff', code: 'B' }, { color: '#8cff1a', code: 'C' }, { color: '#ffff00', code: 'D' }, { color: '#c44dff', code: 'E' }];
  constructor(public workflowService: WorkflowService, private service: ServiceInvokerService, private notificationService: NotificationService, public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getExperiments();
    this.getQueryPipeline();
  }
  //close model popup method
  closeModalPopup() {
    this.varientArray = [];
    this.selectedVariant = [];
    this.showSlider = false;
    this.conn = [true];
    this.tool = [];
    this.star = [100];
    this.experiment = { name: '', variants: [], duration: 0 };
    this.addExperimentsRef.close();
  }
  //open experiment model
  form_type: string;
  exp_id: string;
  addExperiment(type, data) {
    this.form_type = type;
    this.addExperimentsRef = this.addExperiments.open();
    if (type === 'edit') {
      if (data !== undefined) {
        this.exp_id = data._id;
        this.experiment.name = data.name;
        this.varientArray = data.variants;
        this.selectedVariant = data.variants;
        this.experiment.duration = data.duration.days;
      }
    }
  }
  //add new varient method
  varientArray: any = [];
  addVarient() {
    this.star = [];
    console.log("this.varientArray", this.varientArray)
    if (this.varientArray.length < 2) {
      this.varientArray.push(this.varients[this.varientArray.length]);
      this.flag = false;
      // if (this.varientArray.length === 1) {
      //   this.conn.push(true);
      //   this.tool.push(true);
      //   this.star = [100];
      // }
      // else if (this.varientArray.length === 2) {
      //   this.conn.push(true);
      //   this.tool.push(true);
      //   this.star = [50, 50];
      //   console.log(this.conn, this.tool)
      // }
      // else if (this.varientArray.length === 3) {
      //   this.star = [33.33, 33.33, 33.33];
      //   this.conn.push(true);
      //   this.tool.push(true);
      // }
      // else if (this.varientArray.length === 4) {
      //   this.star = [25, 25, 25, 25];
      //   this.conn.push(true);
      //   this.tool.push(true);
      // }
      // this.showSlider = true;
      // console.log("this.star", this.star);
      // this.sliderref.slider.destroy();
      // this.sliderref.slider.updateOptions(this.someRangeconfig, true);
      // setTimeout(() => {
      //   this.showSlider = true;
      // }, 1000);
    }
  }
  //close varient method
  closeVariant(data) {
    const index = this.varientArray.indexOf(data);
    if (index > -1) this.varientArray.splice(index, 1);
  }
  //show or hide search input
  toggleSearch() {
    if (this.showSearch && this.searchFields) {
      this.searchFields = '';
    }
    this.showSearch = !this.showSearch
  }
  //fetch variant inputs
  selectedVariant: any = [];
  select_config;
  fetchVariant(type, name, key) {
    console.log("this.selectedVariant", this.selectedVariant)
    for (let dat of this.varients) {
      if (dat.code === type.code) {
        if (key === 'name' && name !== '') {
          const exist = this.selectedVariant.some(dat => dat.code === type.code);
          console.log("exist", exist)
          if (exist)
            for (let i in this.selectedVariant) {
              if (this.selectedVariant[i].code === type.code) {
                this.selectedVariant[i] = { ...this.selectedVariant[i], name: name };
              }
            }
          else this.selectedVariant.push({ 'code': dat.code, 'color': dat.color, 'name': name, 'trafficPct': 50 })

        }
        else if (key === 'queryid') {
          for (let i in this.selectedVariant) {
            if (this.selectedVariant[i].code === type.code) {
              this.selectedVariant[i].queryPipelineId = name;
            }
          }
        }
      }
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
      console.log("exp list", res)
      this.listOfExperiments = res;
      this.filterExperiments = res;
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
  createExperiment() {
    if (this.form_type === 'add') {
      this.experiment.variants = this.selectedVariant;
      this.experiment.duration = { "days": this.experiment.duration };
      console.log("this.experiment", this.experiment)
      const quaryparms: any = {
        searchIndexId: this.serachIndexId
      };
      this.service.invoke('create.experiment', quaryparms, this.experiment).subscribe(res => {
        console.log("add res", res);
        this.closeModalPopup();
        this.getExperiments();
        this.notificationService.notify('Experiment added successfully', 'success');
      }, errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      });
    }
    else {
      this.experiment.variants = this.selectedVariant.filter(dat => dat.queryPipelineId !== undefined || dat.select_config === undefined);
      this.experiment.duration = { "days": this.experiment.duration };
      console.log("this.experiment", this.experiment)
      const quaryparms: any = {
        searchIndexId: this.serachIndexId,
        experimentId: this.exp_id
      };
      this.service.invoke('edit.experiment', quaryparms, this.experiment).subscribe(res => {
        console.log("add res", res);
        this.closeModalPopup();
        this.getExperiments();
        this.notificationService.notify('Experiment Updated successfully', 'success');
      }, errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      });
    }
  }
  //run an experiment
  runExperiment(id) {
    const quaryparms: any = {
      searchIndexId: this.serachIndexId,
      experimentId: id
    };
    const Obj = { "state": "active" }
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
