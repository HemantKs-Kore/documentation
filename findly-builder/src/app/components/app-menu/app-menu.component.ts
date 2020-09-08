import { Component, OnInit,ViewEncapsulation, HostListener } from '@angular/core';
import { SideBarService } from '../../services/header.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { ActivatedRoute, Routes, Router } from '@angular/router';
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
  constructor( private headerService: SideBarService, private workflowService: WorkflowService, private router: Router) { }
  goHome(){
    this.workflowService.selectedApp(null);
    this.router.navigate(['/apps'], { skipLocationChange: true });
  };
  preview(selection): void {
    const toogleObj = {
      title: selection,
    };
    this.showHideSearch(false);
    this.headerService.toggle(toogleObj);
  }
  showHideSearch(show){
    if(show){
      $('.search-background-div').show();
      $('.start-search-icon-div').addClass('active');
      $('.advancemode-checkbox').css({display:'block'});
    }else{
      $('.search-background-div').hide();
      $('.start-search-icon-div').removeClass('active');
      $('.advancemode-checkbox').css({display:'none'});
    }
  }
  ngOnInit() {
    // this.selected = "accounts";
  }
  // toggle sub-menu
  toggleTranningMenu() {
    this.trainingMenu === false ? this.trainingMenu = true: this.trainingMenu = false;
  }

}
