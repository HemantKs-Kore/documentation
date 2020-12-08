import { Component, OnInit,ViewEncapsulation, HostListener, Input, ViewChild } from '@angular/core';
import { SideBarService } from '../../services/header.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ActivatedRoute, Routes, Router } from '@angular/router';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
declare const $: any;
@Component({
  selector: 'app-mainmenu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppMenuComponent implements OnInit {

  selected = '';
  trainingMenu = false;
  addFieldModalPopRef:any;
  @Input() show;
  @Input() settingMainMenu;
  @ViewChild('addFieldModalPop') addFieldModalPop: KRModalComponent;
  constructor( private headerService: SideBarService, private workflowService: WorkflowService, private router: Router, private activetedRoute:ActivatedRoute) { }
  goHome(){
    this.workflowService.selectedApp(null);
    this.router.navigate(['/apps'], { skipLocationChange: true });
  };
  preview(selection) {
    const toogleObj = {
      title: selection,
    };
    this.headerService.toggle(toogleObj);
  }
  getPreviousState(){
    let previOusState :any = null;
    try {
      previOusState = JSON.parse(window.localStorage.getItem('krPreviousState'));
    } catch (e) {
    }
    return previOusState;
  }
  reloadCurrentRoute() {
    let route = '/source';
    const previousState = this.getPreviousState();
    if(previousState.route){
      route = previousState.route
     }
     try {
       if(this.workflowService.selectedApp() && this.workflowService.selectedApp().searchIndexes && this.workflowService.selectedApp().searchIndexes.length){
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([route],{ skipLocationChange: true });
      });
       }
     } catch (e) {
     }
  }
  selectQueryPipelineId(){
    const activetedRoute:any = this.activetedRoute;
    this.reloadCurrentRoute()
  }
  ngOnInit() {
    // this.selected = "accounts";
  }
  // toggle sub-menu
  switchToTerminal(){
    $('#experimentsTab').click();
    this.closeModalPopup();
  }
  toggleTranningMenu() {
    this.trainingMenu === false ? this.trainingMenu = true: this.trainingMenu = false;
  }
  closeModalPopup(){
    this.addFieldModalPopRef.close();
  }
  openModalPopup(){
    this.addFieldModalPopRef = this.addFieldModalPop.open();
  }
}
