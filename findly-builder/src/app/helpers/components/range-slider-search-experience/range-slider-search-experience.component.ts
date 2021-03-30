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
    this.sliderRet = this.registerSlider('#' + this.allData.id, { tooltip: 'always', tooltip_position: 'bottom' })
    this.sliderRet.bootstrapSlider('setValue', this.allData.default);
    this.formatTooltip(this.allData.default);
  }

  ngOnInit(): void {

  }

  registerSlider(ele, obj) {
    const slider = $(ele).bootstrapSlider(obj);
    $(ele).bootstrapSlider().on('slideStop', (ev) => {
      this.onSliderChanged(ev.value);
    });
    $(ele).bootstrapSlider().on('slide', (ev) => {
      this.formatTooltip(ev.value);
    });
    return slider;
  }

  onSliderChanged(val) {
    this.valueEvent.emit(val);
    this.sliderUpdatedVal = val;
    this.formatTooltip(val);
  }
  formatTooltip(val) { $('#' + this.allData.id + '-slider').find('.tooltip-inner').text(val); }
}
