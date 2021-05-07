import { Component, OnInit, Input, ViewEncapsulation, AfterViewInit, Output, EventEmitter } from '@angular/core';
declare const $: any;
import { RangeSlider } from '../../../helpers/models/range-slider.model';
@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class RangeSliderComponent implements OnInit, AfterViewInit {
  @Input() allData;
  @Input() customClass;
  @Input() addTextToTooltip;
  @Output() valueEvent = new EventEmitter();
  sliderUpdatedVal: number;
  sliderRet: any;
  constructor() { }

  ngAfterViewInit() {
    this.sliderRet = this.registerSlider('#'+this.allData.id, { tooltip_position: 'top'})
    this.sliderRet.bootstrapSlider('setValue', this.allData.default);
    this.formatTooltip(this.allData.default);
  }

  ngOnInit(): void {

  }

  registerSlider(ele,obj){
    const slider =$(ele).bootstrapSlider(obj);
    $(ele).bootstrapSlider().on('slideStop', (ev) => {
      this.onSliderChanged(ev.value);
    });
    $(ele).bootstrapSlider().on('slide', (ev) => {
      this.formatTooltip(ev.value,true);
    });
    return slider;
  }

  onSliderChanged(val) {
    this.valueEvent.emit(val);
    this.sliderUpdatedVal = val;
    this.formatTooltip(val,false);
  }
  formatTooltip(val, hide?){ 
    if(hide){
      $('#' + this.allData.id + '-slider').find('.tooltip-main').removeClass('hide');
    }
    else{
      $('#' + this.allData.id + '-slider').find('.tooltip-main').addClass('hide');
    }
    $('#'+this.allData.id+'-slider').find('.tooltip-inner').text(val+(this.addTextToTooltip?this.addTextToTooltip:'')); }
}

