import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { NotificationService } from '../../services/notification.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';


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
  };
  searchBlock = '';
  addAttributesModalPopRef:any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('addAttributesModalPop') addAttributesModalPop: KRModalComponent;
  
  constructor( private service: ServiceInvokerService,
              private workflowService: WorkflowService,
              private notify: NotificationService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.selectedApp();
    this.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    this.getAttributes();
  }

  checkDuplicateTags(suggestion: string): boolean {
    return this.addEditattribute.attributes.every((f) => f.tag !== suggestion);
  }

  addAltTag(event: MatChipInputEvent): void {
    // debugger;
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {

      if (!this.checkDuplicateTags((value || '').trim())) {
        this.notify.notify('Duplicate tags are not allowed', 'warning');
      } else {
        this.addEditattribute.attributes.push({ value: value.trim()});
      }
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
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
     type: this.addEditattribute.type,
     isFacet: this.addEditattribute.isFacet
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
