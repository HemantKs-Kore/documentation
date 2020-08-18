import { Component, OnInit,ViewEncapsulation, HostListener } from '@angular/core';
import { SideBarService } from '../../services/header.service';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainmenuComponent implements OnInit {

  selected = '';
  constructor( private headerService: SideBarService) { }

  preview(selection): void {
    const toogleObj = {
      title: selection,
    };
    this.headerService.toggle(toogleObj);
  }

  ngOnInit() {
    // this.selected = "accounts";
  }

}
