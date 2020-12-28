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
  conn: any = [true, true];
  tool: any = [true];
  star: any = [100];
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
    this.conn = [true, true];
    this.tool = [true];
    this.star = [100];
    this.experiment = { name: '', variants: [], duration: 0 };
    this.addExperimentsRef.close();
  }
  //open experiment model
  form_type: string;
  exp_id: string;
  status: string;
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
        this.status = data.state;
        console.log("data update", data);
        if (data.variants.length === 1) {
          this.showSlider = true;
        }
        else if (data.variants.length >= 2) {
          this.star = [];
          this.conn.push(true);
          this.tool.push(true);
          for (let i = 0; i < data.variants.length; i++) {
            this.star.push(data.variants[i].trafficPct);
          }

        }
        this.someRangeconfig = { ...this.someRangeconfig, start: this.star };
        if (data.variants.length > 1) {
          setTimeout(() => {
            this.showSlider = false;
            this.sliderref.slider.destroy();
            this.sliderref.slider.updateOptions(this.someRangeconfig, true);
          }, 1000)
          setTimeout(() => {
            this.showSlider = true;
          }, 2000);
        }
      }
    }
  }
  //add new varient method
  varientArray: any = [];
  addVarient() {
    if (this.varientArray.length < 4) {
      this.varientArray.push(this.varients[this.varientArray.length]);
      if (this.varientArray.length === 1) {
        this.showSlider = true;
      }
      else if (this.varientArray.length === 2) {
        this.star = [];
        this.conn.push(true);
        this.tool.push(true);
        this.star.push(50, 100);
      }
      else if (this.varientArray.length === 3) {
        this.star = [];
        this.conn.push(true);
        this.tool.push(true);
        this.star.push(33.3, 66.3, 100);
      }
      else if (this.varientArray.length === 4) {
        this.star = [];
        this.conn.push(true);
        this.tool.push(true);
        this.star.push(25, 50, 75, 100);
      }
      this.someRangeconfig = { ...this.someRangeconfig, start: this.star };
      if (this.varientArray.length > 1) {
        setTimeout(() => {
          this.showSlider = false;
          this.sliderref.slider.destroy();
          this.sliderref.slider.updateOptions(this.someRangeconfig, true);
        }, 1000)
        setTimeout(() => {
          this.showSlider = true;
        }, 2000);
      }
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
          else this.selectedVariant.push({ 'code': dat.code, 'color': dat.color, 'name': name })
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
      this.listOfExperiments = res;
      this.filterExperiments = res;
      this.status_active = res.filter(item => item.state === 'configured').length > 1 ? true : false;
      console.log("status_active", this.status_active)
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
      if (this.varientArray.length === 1) {
        for (let i in this.selectedVariant) {
          this.selectedVariant[i] = { ...this.selectedVariant[i], trafficPct: 100 }
        }
      }
      if (this.varientArray.length === 2) {
        if (this.someRange === undefined) {
          for (let i in this.selectedVariant) {
            this.selectedVariant[i] = { ...this.selectedVariant[i], trafficPct: 50 }
          }
        }
        else {
          for (let i = 0; i < this.selectedVariant.length; i++) {
            if (i == 0) {
              this.selectedVariant[i] = { ...this.selectedVariant[i], trafficPct: parseInt(this.someRange[0]) }
            }
            else {
              this.selectedVariant[i] = { ...this.selectedVariant[i], trafficPct: 100 - parseInt(this.someRange[0]) }
            }
          }
        }
      }
      if (this.varientArray.length === 3) {
        if (this.someRange === undefined) {
          for (let i in this.selectedVariant) {
            this.selectedVariant[i] = { ...this.selectedVariant[i], trafficPct: 33.34 }
          }
        }
        else {
          for (let i = 0; i < this.selectedVariant.length; i++) {
            if (i == 0) {
              this.selectedVariant[i] = { ...this.selectedVariant[i], trafficPct: parseInt(this.someRange[0]) }
            }
            else if (i == 1) {
              let sum = parseInt(this.someRange[1]) - parseInt(this.someRange[0]);
              this.selectedVariant[i] = { ...this.selectedVariant[i], trafficPct: sum }
            }
            else if (i == 2) {
              let sum = parseInt(this.someRange[0]) + (parseInt(this.someRange[1]) - parseInt(this.someRange[0]));
              this.selectedVariant[i] = { ...this.selectedVariant[i], trafficPct: 100 - Math.abs(sum) }
            }
          }
        }
      }
      if (this.varientArray.length === 4) {
        if (this.someRange === undefined) {
          for (let i in this.selectedVariant) {
            this.selectedVariant[i] = { ...this.selectedVariant[i], trafficPct: 25 }
          }
        }
        else {
          for (let i = 0; i < this.selectedVariant.length; i++) {
            if (i == 0) {
              this.selectedVariant[i] = { ...this.selectedVariant[i], trafficPct: parseInt(this.someRange[0]) }
            }
            else if (i == 1) {
              this.selectedVariant[i] = { ...this.selectedVariant[i], trafficPct: parseInt(this.someRange[1]) - parseInt(this.someRange[0]) }
            }
            else if (i == 2) {
              let sum =
                this.selectedVariant[i] = { ...this.selectedVariant[i], trafficPct: parseInt(this.someRange[2]) - parseInt(this.someRange[1]) }
            }
            else if (i == 3) {
              let sum = parseInt(this.someRange[0]) + (parseInt(this.someRange[1]) - parseInt(this.someRange[0])) + (parseInt(this.someRange[2]) - parseInt(this.someRange[1]));
              this.selectedVariant[i] = { ...this.selectedVariant[i], trafficPct: 100 - sum }
            }
          }
        }
      }
      this.experiment.variants = this.selectedVariant;
      this.experiment.duration = { "days": this.experiment.duration };
      console.log("this.experiment", this.experiment);
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
      // const quaryparms: any = {
      //   searchIndexId: this.serachIndexId,
      //   experimentId: this.exp_id
      // };
      // this.service.invoke('edit.experiment', quaryparms, this.experiment).subscribe(res => {
      //   console.log("add res", res);
      //   this.closeModalPopup();
      //   this.getExperiments();
      //   this.notificationService.notify('Experiment Updated successfully', 'success');
      // }, errRes => {
      //   if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
      //     this.notificationService.notify(errRes.error.errors[0].msg, 'error');
      //   } else {
      //     this.notificationService.notify('Failed ', 'error');
      //   }
      // });
    }
  }
  //run an experiment
  runExperiment(id, event) {
    event.stopPropagation();
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
