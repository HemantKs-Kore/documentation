import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { KRModalComponent } from '../../shared/kr-modal/kr-modal.component';
import { NotificationService } from '../../services/notification.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { cloneDeep } from "lodash";

import * as _ from 'underscore';


@Component({
  selector: 'app-attributes-list',
  templateUrl: './attributes-list.component.html',
  styleUrls: ['./attributes-list.component.scss']
})
export class AttributesListComponent implements OnInit {
  attributes: any;
  loading: boolean = true;
  selectedApp;
  searchIndexId;
  addEditattribute : any = {
    name:'',
    attributes:[],
    type:'custom',
    isFacet:''
  };
  isAdd: boolean = false;
  isEdit: boolean = false;
  searchBlock = '';
  addAttributesModalPopRef:any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('addAttributesModalPop') addAttributesModalPop: KRModalComponent;
  
  constructor( private service: ServiceInvokerService,
              private workflowService: WorkflowService,
              private notify: NotificationService,
              public dialog: MatDialog,
            ) { }

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
      this.isAdd = false;
      this.isEdit = true;
      this.addEditattribute = cloneDeep(group);
    } else{
      this.isAdd = true;
      this.isEdit = false;
      this.addEditattribute= {
        name:'',
        attributes:[],
        type:'custom',
        isFacet:''
      }
    }
    this.openAddAttributesModal();
  }

  removeAltTag(tag): void {
    const index = this.addEditattribute.attributes.indexOf(tag);
    if (index >= 0) {
      this.addEditattribute.attributes.splice(index, 1);
    }
  }

  getAttributes(){
    const quaryparamats = {
      searchIndexId : this.searchIndexId,
   }
   this.service.invoke('get.groups', quaryparamats).subscribe(
    res => {
      this.attributes = {
        groups: []
      };
      this.attributes.groups = _.where(res.groups, {action: 'new'});
      this.loading = false;
    },
    errRes => {
      this.loading = false;
    // this.errorToaster(errRes)
    }
  );
   }

  deleteField (fieldData) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: 'delete-popup',
      data: {
        title: 'Delete Field',
        text: 'Are you sure you want to delete "'+ fieldData.name +'" field?',
        buttons: [{ key: 'yes', label: 'OK', type: 'danger' }, { key: 'no', label: 'Cancel' }]
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          const params = {
            searchIndexId: this.searchIndexId,
            groupId: fieldData._id
          };
          this.service.invoke('delete.group', params).subscribe(
            res => {
            //  this.getRules();
            this.getAttributes();

            }, err => {
     
            })
          dialogRef.close();
        } else if (result === 'no') { dialogRef.close(); }
      });
  };

  editAttributes() {
    console.log(this.addEditattribute);
    let params = {
      searchIndexId: this.searchIndexId,
      groupId: this.addEditattribute._id
    };
    let payload = {
      attributes: this.addEditattribute.attributes,
      name: this.addEditattribute.name
    };
    this.service.invoke('update.group', params, payload).subscribe(res=>{
      this.getAttributes();
      this.notify.notify('Attribute updated successfully','success');
      this.closeAddAttributesModal();
    }, err=> {
      this.errorToaster(err,'Failed to create group');
      this.closeAddAttributesModal();
    });
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
