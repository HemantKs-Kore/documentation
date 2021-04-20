import { Component, OnInit, Input, ViewEncapsulation, AfterViewInit, Output, EventEmitter } from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-range-slider-search-experience',
  templateUrl: './range-slider-search-experience.component.html',
  styleUrls: ['./range-slider-search-experience.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RangeSliderSearchExperienceComponent implements OnInit {
  @Input() allData;
  @Input() customClass;
  @Output() valueEvent = new EventEmitter();
  sliderUpdatedVal: number;
  sliderRet: any;
  constructor() { }

  ngAfterViewInit() {
    this.sliderRet = this.registerSlider('#' + this.allData.id, { tooltip_position: 'top'}, this.allData.key)
    this.sliderRet.bootstrapSlider('setValue', this.allData.default);
    this.formatTooltip(this.allData.default);
  }

  ngOnInit(): void {

  }

  registerSlider(ele, obj, key?) {
    if(key && key == 'bottom-up-live'){
      obj.ticks = [0, 1, 2, 3, 4, 5];
      obj.ticks_positions = [0, 20, 40, 60, 80, 100];
      obj.ticks_labels = ['0', '1', '2', '3', '4', '5'];
    }
    else if(key && key == 'bottom-up-suggestion'){
      obj.ticks = [0, 1, 2, 3];
      obj.ticks_positions = [0, 33, 66, 100];
      obj.ticks_labels = ['0', '1', '2', '3'];
    }
    else if(key && key == 'top-down-suggestion'){
      obj.ticks = [0, 1, 2, 3, 4, 5];
      obj.ticks_positions = [0, 20, 40, 60, 80, 100];
      obj.ticks_labels = ['0', '1', '2', '3', '4', '5'];
    }
    else if(key && key == 'top-down-live'){
      obj.ticks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      obj.ticks_positions = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      obj.ticks_labels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    }
    const slider = $(ele).bootstrapSlider(obj);
    $(ele).bootstrapSlider().on('slideStop', (ev) => {
      this.onSliderChanged(ev.value);
    });
    $(ele).bootstrapSlider().on('slide', (ev) => {
      this.formatTooltip(ev.value, true);
    });
    return slider;
  }

  onSliderChanged(val) {
    this.valueEvent.emit(val);
    this.sliderUpdatedVal = val;
    this.formatTooltip(val, false);
  }
  formatTooltip(val, hide?) {
    if(hide){
      $('#' + this.allData.id + '-slider').find('.tooltip-main').removeClass('hide');
    }
    else{
      $('#' + this.allData.id + '-slider').find('.tooltip-main').addClass('hide');
    }
    $('#' + this.allData.id + '-slider').find('.tooltip-inner').text(val); 
  }
}
