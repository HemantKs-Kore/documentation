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
  @Input() hasFooter: boolean;
  modalTypes = {
    FULL: 'full',
    SLIDE: 'slide',
    CENTER: 'center',
    NOBACKDROP:"nodrop",
    BACKDROPMODALTOP:"above-modal-drop"
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
      backdrop: 'static',
      keyboard : false
    };
    if (this.modalClass) {
      config.windowClass = config.windowClass + ' ' + this.modalClass;
    }
    if (this.hasFooter) {
      config.windowClass = config.windowClass + ' ' + 'containsFooter';
    }
    if (this.modalType === this.modalTypes.FULL) {
      _.extend(config, {
        backdropClass: 'kr-back-drop full-back-drop',
        windowClass: 'kr-modal kr-full ' + (this.modalClass || ''),
        backdrop: 'static',
        keyboard : false
      });
    }
    if (this.modalType === this.modalTypes.CENTER) {
      _.extend(config, {
        backdropClass: 'kr-back-drop full-back-drop',
        windowClass: 'kr-modal kr-center ' + (this.modalClass || ''),
        backdrop: 'static',
        keyboard : false
      });
    }

    if (this.modalType === this.modalTypes.NOBACKDROP) {
      _.extend(config, {
        backdropClass: 'kr-back-drop no-back-drop',
        windowClass: 'kr-modal kr-center ' + (this.modalClass || ''),
        backdrop: 'static',
        keyboard : false
      });
    }

    if (this.modalType === this.modalTypes.BACKDROPMODALTOP) {
      _.extend(config, {
        backdropClass: 'kr-back-drop above-modal-drop-class',
        windowClass: 'kr-modal kr-center ' + (this.modalClass || ''),
        backdrop: 'static',
        keyboard : false
      });
    }

    if (this.modalType === this.modalTypes.SLIDE) {
      _.extend(config, {
        backdropClass: 'kr-back-drop',
        windowClass: 'kr-modal kr-slide ' + (this.modalClass || ''),
        backdrop: 'static',
        keyboard : false
      });
    }

    return this.modalService.open(
      this.hostContentsWrap, config);
  }

}
