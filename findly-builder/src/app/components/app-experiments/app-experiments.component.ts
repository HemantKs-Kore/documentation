import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
@Component({
  selector: 'app-app-experiments',
  templateUrl: './app-experiments.component.html',
  styleUrls: ['./app-experiments.component.scss']
})
export class AppExperimentsComponent implements OnInit {
  addExperimentsRef:any;
  selectedApp:any;
  serachIndexId:any;
  experiment:any={
    name:'',
    variants:[],
    duration:0
  }
  @ViewChild('addExperiments') addExperiments: KRModalComponent;
  varients=[{color:'#ff0000',code:'A'},{color:'#0000ff',code:'B'},{color:'#8cff1a',code:'C'},{color:'#ffff00',code:'D'},{color:'#c44dff',code:'E'}];
  constructor(public workflowService: WorkflowService,private service: ServiceInvokerService,private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getExperiments();
    this.getQueryPipeline();
  }
  //close model popup method
  closeModalPopup(){
    this.varientArray = [];
    this.selectedVariant = [];
    this.experiment={name:'',variantData:[],duration:0};
    this.addExperimentsRef.close();
  }
  //open experiment model 
  addExperiment(){
    this.addExperimentsRef = this.addExperiments.open();
  }
  //add new varient method
  varientArray:any=[];
  addVarient(){
    if(this.varientArray.length<=4)
      this.varientArray.push(this.varients[this.varientArray.length]);
  }
  //close varient method
  closeVariant(data){
    const index = this.varientArray.indexOf(data); 
    if (index > -1) this.varientArray.splice(index, 1);
  }
  //fetch variant inputs
  selectedVariant:any=[];
  select_config;
  fetchVariant(type,name,key){
   for(let dat of this.varients){
    if(dat.code === type.code){
      if(key==='name' && name!== '') {this.selectedVariant.push({...dat,'name':name,'trafficPct':50})}
      else{
        for(let i in this.selectedVariant){
          if(this.selectedVariant[i].code === type.code){
            this.selectedVariant[i].queryPipelineId = name;
          }
        }
      }
    }
   }
  }
  //get list of querypipelines method
  queryPipeline:any=[];
  getQueryPipeline(){
      const header : any= {
        'x-timezone-offset': '-330'
      };
      const quaryparms: any = {
        searchIndexId: this.serachIndexId,
        offset: 0,
        limit:100
      };
      this.service.invoke('get.queryPipelines', quaryparms,header).subscribe(res => {
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
  listOfExperiments:any=[];
  filterExperiments:any=[];
  allExp:number;
  confExp:number;
  actExp:number;
  pauExp:number;
  compExp:number;
  getExperiments(){
      const header : any= {
        'x-timezone-offset': '-330'
      };
      const quaryparms: any = {
        searchIndexId: this.serachIndexId,
        offset: 0,
        limit:100,
        state:'all'
      };
      this.service.invoke('get.experiment', quaryparms,header).subscribe(res => {
        this.listOfExperiments = res;
        this.filterExperiments = res;
        this.allExp = this.listOfExperiments.length;
        this.confExp = this.listOfExperiments.filter(item=>item.state === "configured").length;
        this.actExp = this.listOfExperiments.filter(item=>item.state === "active").length;
        this.pauExp = this.listOfExperiments.filter(item=>item.state === "paused").length;
        this.compExp = this.listOfExperiments.filter(item=>item.state === "completed").length;
       }, errRes => {
         if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
           this.notificationService.notify(errRes.error.errors[0].msg, 'error');
         } else {
           this.notificationService.notify('Failed ', 'error');
         }
       });
  }
  //add new experiment method
  createExperiment(){
    this.experiment.variants = this.selectedVariant;
    this.experiment.duration={"days":this.experiment.duration};
    console.log("experiment",this.experiment);
    const quaryparms: any = {
      searchIndexId: this.serachIndexId
    };
    this.service.invoke('create.experiment',quaryparms,this.experiment).subscribe(res => {
      console.log("add res",res);
      this.closeModalPopup();
      this.notificationService.notify('Experiment added successfully','success');
      }, errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      });
  }
  //filter list using tabs
  setTab:string='all';
  selectedTab(type){
    let filterArray:any= this.filterExperiments;
    this.setTab = type;
   if(type==='all'){
    this.listOfExperiments = this.filterExperiments;
   }
   else if(type==='configured'){
    this.listOfExperiments = filterArray.filter(item=>item.state === 'configured');
   }
   else if(type==='active'){
    this.listOfExperiments = filterArray.filter(item=>item.state === 'active');
   }
   else if(type==='paused'){
    this.listOfExperiments = filterArray.filter(item=>item.state === 'paused');
   }
   else if(type==='completed'){
    this.listOfExperiments = filterArray.filter(item=>item.state === 'completed');
   }
  }
}
