import { Component, OnInit, ElementRef, ViewChild, Input, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'underscore';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'kr-modal',
  templateUrl: './kr-modal.component.html',
  styleUrls: ['./kr-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KRModalComponent implements OnInit, AfterViewInit {
  @Input() modalType: string;
  @Input() modalClass: string;
  modalTypes = {
    FULL: 'full',
    SLIDE: 'slide'
  };
  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {

  }

  @ViewChild('hostContentsWrap') hostContentsWrap: ElementRef;


  ngAfterViewInit() {
    // console.log('ngAfterViewInit');
    setTimeout(() => {
      // this.modalService.open(this.hostContentsWrap)
    }, 0);
  }


  ngOnInit() {
    this.modalType = this.modalType || 'default';
  }
  open() {
    const config: any = {
      backdropClass: 'kr-back-drop',
      windowClass: 'kr-modal',
      backdrop: 'static'
    };
    if (this.modalClass) {
      config.windowClass = config.windowClass + ' ' + this.modalClass;
    }
    if (this.modalType === this.modalTypes.FULL) {
      _.extend(config, {
        backdropClass: 'kr-back-drop full-back-drop',
        windowClass: 'kr-modal kr-full',
        backdrop: 'static'
      });
    }

    if (this.modalType === this.modalTypes.SLIDE) {
      _.extend(config, {
        backdropClass: 'kr-back-drop',
        windowClass: 'kr-modal kr-slide',
        backdrop: 'static'
      });
    }

    return this.modalService.open(
      this.hostContentsWrap, config);
  }

}
