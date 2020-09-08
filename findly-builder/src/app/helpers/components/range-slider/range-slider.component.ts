import { Component, OnInit, Input, ViewEncapsulation, AfterViewInit } from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class RangeSliderComponent implements OnInit, AfterViewInit {
  @Input() allData;
  sliderUpdatedVal: number;
  sliderRet: any;
  constructor() { }

  ngAfterViewInit() {
    this.sliderRet = this.registerSlider('#'+this.allData.id, {tooltip: 'always', tooltip_position: 'bottom'})
    this.sliderRet.bootstrapSlider('setValue', this.allData.default);
    this.formatTooltip(this.allData.default);
  }

  ngOnInit(): void {

  }

  registerSlider(ele,obj){
    var slider =$(ele).bootstrapSlider(obj);
    $(ele).bootstrapSlider().on('slideStop', (ev) => {  
      this.onSliderChanged(ev.value); 
    });
    $(ele).bootstrapSlider().on('slide', (ev) => {  
      this.formatTooltip(ev.value); 
    });
    return slider;
  }

  onSliderChanged(val) {
    this.sliderUpdatedVal = val;
    this.formatTooltip(val);
  }
  formatTooltip(val){ $("#"+this.allData.id+"-slider").find(".tooltip-inner").text(val); }
}

