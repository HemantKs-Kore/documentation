import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { Subscription } from 'rxjs';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';








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
  serachIndexId;
  seedData;
  saveLanguages:boolean = false
  configurationsSubscription : Subscription;
  supportedLanguages:any = [];
  listOfLanguages:any = [];
  listLanguages:any = [{
    language: "English",
    code: "en"
    }]
  languageList:any = [];


  @ViewChild('addLangModalPop') addLangModalPop: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private appSelectionService: AppSelectionService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
      this.getAvilableLanguages();
      this.selectedApp = this.workflowService.selectedApp();
      this.serachIndexId = this.selectedApp.searchIndexes[0]._id;
      this.indexPipelineId = this.workflowService.selectedIndexPipeline();
      this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : ''
      this.supportedLanguages = this.workflowService?.supportedLanguages?.values;
      this.configurationsSubscription = this.appSelectionService.queryConfigSelected.subscribe(res => {
        this.indexPipelineId = this.workflowService.selectedIndexPipeline();
        this.queryPipelineId = this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : ''
        this.supportedLanguages = this.workflowService.supportedLanguages.values;
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
    this.supportedLanguages.forEach(element => {
      this.languageList.forEach(lang => {
        if(element.languageCode == lang.languageCode){
          lang.selected = true;
        } 
      }); 
    });
  }
// close pop for add and edit 
  closeModalPopup() {
    this.addLangModalPopRef.close();
    this.saveLanguages = false;
    this.clearCheckbox();
  }
  //geting the seedData
  getAvilableLanguages(){
    let  url = 'get.indexAvailableLanguages'
    this.service.invoke(url).subscribe(
      res => {
       this.languageList = res.languages;
      },
      errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed To Get Available Languages', 'error');
        }
      }
    );
  }
  // clearing the seedData
  clearCheckbox(){
    let arr = [...this.supportedLanguages]
    let dumyArr = []
    arr.forEach(arrElement => {
      dumyArr.push(arrElement.languageCode)
    });
    this.languageList.forEach(element => {
      if(dumyArr.includes(element.languageCode)){
        element.selected = true;
      }else{
        element.selected = false;
      }
    });
  }
  //adding Language 
  addLanguage(index){
    this.languageList[index].selected = !this.languageList[index].selected
  }
  addLang(){
    let langArr = [];
    this.languageList.forEach(element => {
      if(element.selected){
        langArr.push(element);
      }
    });
    this.saveLanguage('',langArr)
  }
  //add or edit Language
  saveLanguage(dialogRef?,langArr?){
        let queryParams = {
          streamId:this.selectedApp._id,
          indexPipelineId:this.indexPipelineId
        }
        let payload = {
            language: {
              enable: true ,
              values: langArr
            }
        }
        let  url = 'put.indexLanguages'
        this.service.invoke(url, queryParams, payload).subscribe(
          res => {
            this.getIndexPipeline()
            if (dialogRef && dialogRef.close) {
              dialogRef.close();
            }
            this.notificationService.notify('Language Saved Successfully', 'success');
          },
          errRes => {
            if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
              this.notificationService.notify(errRes.error.errors[0].msg, 'error');
            } else {
              this.notificationService.notify('Failed To Add Language', 'error');
            }
          }
        );
    this.closeModalPopup();
  }
  //selection and deselection method
  unCheck(){
    this.supportedLanguages.forEach(element => {
      this.languageList.forEach(data => {
        if(element.languageCode == data.languageCode){
          data.selected = true
        }
        else{
          data.selected = false
        }
      });
    });
  }
  updateLangListFun(list){
    let updateArr = [];
    this.supportedLanguages.forEach((element,index) => {
      if(element.languageCode != list.languageCode){
       updateArr.push(element)
      }
    });
    this.supportedLanguages = updateArr
    return updateArr;
  }
  //delete language
  deleteLanguagesPop(event,list) {
      if (event) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '530px',
        height: 'auto',
        panelClass: 'delete-popup',
        data: {
          title: 'Delete Language',
          text: 'Are you sure you want to remove?',
          newTitle: 'Are you sure you want to remove?',
          body: 'The'+list.language+ 'language will be removed.'+list.language+'content will be searched using English language analyzers.' ,
          buttons: [{ key: 'yes', label: 'Delete', type: 'danger' }, { key: 'no', label: 'Cancel' }],
          confirmationPopUp: true
        }
      });

      dialogRef.componentInstance.onSelect
        .subscribe(result => {
          if (result === 'yes' ) {
          this.deleteLanguage(dialogRef,list);
          } else if (result === 'no') {
            dialogRef.close();
          }
        })
  }
  deleteLanguage(dialogRef?,list?){
      this.unCheck()
      let updateArr = this.updateLangListFun(list);
      this.saveLanguage(dialogRef,updateArr)
  }
    //Use a better Apporch so that we can restrict this call for IndexPipline - use Observable
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
        res.forEach(element => {
          if(element._id == this.indexPipelineId){
            this.supportedLanguages = element.settings.language.values;
            this.workflowService.getSettings(element.settings);
          }
        });
      }, errRes => {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      });
  }
  ngOnDestroy() {
    this.configurationsSubscription ? this.configurationsSubscription.unsubscribe() : false;
  }
}
