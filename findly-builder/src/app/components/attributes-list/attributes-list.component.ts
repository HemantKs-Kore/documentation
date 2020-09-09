import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-attributes-list',
  templateUrl: './attributes-list.component.html',
  styleUrls: ['./attributes-list.component.scss']
})
export class AttributesListComponent implements OnInit {
  attributes: any;
  loading: boolean;
  selectedApp;
  searchIndexId;
  addEditattribute : any = {
    name:'',
    attributes:[],
    type:'custom',
    isFacet:''
  }
  addAttributesModalPopRef:any;

  @ViewChild('addAttributesModalPop') addAttributesModalPop: KRModalComponent;
  
  constructor( private service: ServiceInvokerService,
              private workflowService: WorkflowService,
              private notify: NotificationService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getAttributes();
  }

  addEditAttibutes(group?){
    if(group){
      this.addEditattribute = group
    } else{
      this.addEditattribute= {
        name:'',
        attributes:[],
        type:'custom',
        isFacet:''
      }
      this.openAddAttributesModal();
    }
   }

  getAttributes(){
    const quaryparamats = {
      searchIndexId : this.searchIndexId,
   }
   this.service.invoke('get.groups', quaryparamats).subscribe(
    res => {
      this.attributes = res;
      this.loading = false;
    },
    errRes => {
      this.loading = false;
    // this.errorToaster(errRes)
    }
  );
   }
   saveAttributes(){
    const quaryparamats = {
       searchIndexId : this.searchIndexId
    }
    console.log(this.addEditattribute);
    const payload = {
     attributes :this.addEditattribute.attributes,
     name: this.addEditattribute.name,
     type: this.addEditattribute.type
    }
    this.service.invoke('create.group', quaryparamats , payload).subscribe(
     res => {
       this.notify.notify('Attribute saved successfully','success');
       this.closeAddAttributesModal();
       this.getAttributes();
     },
     errRes => {
       this.errorToaster(errRes,'Failed to create group');
     }
   );
  }

  errorToaster(errRes,message?){
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg ) {
      this.notify.notify(errRes.error.errors[0].msg, 'error');
    } else if (message){
      this.notify.notify(message, 'error');
    } else {
      this.notify.notify('Somthing went worng', 'error');
  }
 }

  closeAddAttributesModal() {
    if (this.addAttributesModalPopRef &&  this.addAttributesModalPopRef.close) {
      this.addAttributesModalPopRef.close();
    }
   }
   openAddAttributesModal() {
    this.addAttributesModalPopRef  = this.addAttributesModalPop.open();
   }

}
