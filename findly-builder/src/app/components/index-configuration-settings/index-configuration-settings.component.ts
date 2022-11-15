import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { Subscription } from 'rxjs';






@Component({
  selector: 'app-index-configuration-settings',
  templateUrl: './index-configuration-settings.component.html',
  styleUrls: ['./index-configuration-settings.component.scss']
})
export class IndexConfigurationSettingsComponent implements OnInit {

  addLangModalPopRef: any;
  indexPipelineId;
  queryPipelineId;
  searchLanguages:any = '';
  selectedApp;
  seedData;
  saveLanguages:boolean = false
  configurationsSubscription : Subscription;
  addedlanguageList:any = [];
  listOfLanguages:any = [];
  listLanguages:any = [{
    language: "English",
    code: "en"
    }]
  languageList:any = [
    {
      language:'English',
      code:'en',
      selected:false
    },
    {
      language:'Korean',
      code:'ko',
      selected:false
    },
    {
      language:'Japanese',
      code:'ja',
      selected:false
    },
    {
      language:'German',
      code:'ge',
      selected:false
    },
  ];


  @ViewChild('addLangModalPop') addLangModalPop: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private appSelectionService: AppSelectionService,
  ) { }

  ngOnInit(): void {
      this.selectedApp = this.workflowService.selectedApp();
      this.configurationsSubscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      this.seedData = this.workflowService.seedData();
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : ''
    })
  }
  
// toaster message 
  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went wrong', 'error');
    }
  }

// open pop for add and edit 
  openModalPopup() {
    this.addLangModalPopRef = this.addLangModalPop.open();
  }

// close pop for add and edit 
  closeModalPopup() {
    this.addLangModalPopRef.close();
    this.saveLanguages = false;
    this.clearCheckbox();
  }
  clearCheckbox(){
    let arr = [...this.addedlanguageList]
    let dumyArr = []
    arr.forEach(arrElement => {
      dumyArr.push(arrElement.code)
    });
    this.languageList.forEach(element => {
      if(dumyArr.includes(element.code)){
        element.selected = true;
      }else{
        element.selected = false;
      }
    });
  }
  addLanguage(index){
    this.languageList[index].selected = !this.languageList[index].selected
  }

  saveLanguage(){
        this.saveLanguages = true;
        if(this.saveLanguages){
          this.addedlanguageList = []
          this.languageList.forEach(element => {
          if(element.selected) this.addedlanguageList.push(element);
        });
          this.notificationService.notify('Language Saved Successfully', 'success');
      }
        // let queryParams = {
        //   streamId:this.selectedApp._id,
        //   indexPipelineId:this.indexPipelineId
        // }
        // let payload = {
        //   languages: {
        //   enable: true ,
        //   values: this.addedlanguageList
        //   }
        //   }
        // let  url = 'put.indexLanguages'
        // this.service.invoke(url, queryParams, payload).subscribe(
        //   res => {
        //     if(res && this.saveLanguages){
        //       this.addedlanguageList = []
        //       this.languageList.forEach(element => {
        //       if(element.selected) this.addedlanguageList.push(element);
        //     });
        //       this.notificationService.notify('Language Saved Successfully', 'success');
        //   }
        //   },
        //   errRes => {
        //     if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
        //       this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        //     } else {
        //       this.notificationService.notify('Failed To Add Language', 'error');
        //     }
        //   }
        // );
    this.closeModalPopup();
  }
  deleteLanguage(index){
    this.addedlanguageList.splice(index,1);
    this.addedlanguageList.forEach(element => {
      this.languageList.forEach(data => {
        if(element.code == data.code){
          data.selected = true
        }
        else{
          data.selected = false
        }
      });
    });
    this.saveLanguage()
  }

  ngOnDestroy() {
    this.configurationsSubscription ? this.configurationsSubscription.unsubscribe() : false;
  }
}
