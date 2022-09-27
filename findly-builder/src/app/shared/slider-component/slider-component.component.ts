import { Component, OnInit, ViewEncapsulation } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-slider-component',
  templateUrl: './slider-component.component.html',
  styleUrls: ['./slider-component.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'app-slider'
})
export class SliderComponentComponent implements OnInit {
  rightClass: any;
  constructor() { }


  ngOnInit() {

  }

  openSlider(parentSelector, width) {
    this.rightClass = width;
    const modalEle = '#sliderComponent';
    let sliderEle = $(modalEle);
    if (parentSelector) {
      sliderEle = $(parentSelector).find(modalEle);
    } 
    sliderEle.addClass('open');
    setTimeout(() => {
      sliderEle.find('.sliderDialogComponent').animate({ right: '0' });
      $('body').addClass('bt-modal-open');
      sliderEle.show();
      if (width && !sliderEle.find('.sliderDialogComponent').hasClass(width)) {
        sliderEle.find('.sliderDialogComponent').addClass(width);
      }
    }, 200);
  }

  closeSlider(parentSelector) {
    const modalEle = '#sliderComponent';
    let sliderEle = $(modalEle);
    if (parentSelector) {
      sliderEle = $(parentSelector).find(modalEle);
    }
    if (sliderEle.find('.sliderDialogComponent').hasClass('width500')) {
      sliderEle.find('.sliderDialogComponent').removeClass('width500');
    }
    sliderEle.removeClass('open');
    sliderEle.find('.sliderDialogComponent').animate({ right: '-' + sliderEle.find('.sliderDialogComponent').width() + 'px' });
    setTimeout(() => {
      sliderEle.hide();
      if (!$('.modal-backdrop.in').is(':visible')) {
        $('body').removeClass('bt-modal-open');
      }
    }, 200);
  }
}
