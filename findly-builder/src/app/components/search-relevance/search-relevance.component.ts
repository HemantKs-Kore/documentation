import { Component, OnInit } from '@angular/core';
import { RangeSlider } from '../../helpers/models/range-slider.model';

@Component({
  selector: 'app-search-relevance',
  templateUrl: './search-relevance.component.html',
  styleUrls: ['./search-relevance.component.scss'],
})
export class SearchRelevanceComponent implements OnInit {
  weightModal;
  constructor() {}
  sliderOpen;
  disableCancle: any = true;
  ngOnInit(): void {
    this.prepereSliderObj(1, 2);
  }

  prepereSliderObj(index, scale?) {
    return new RangeSlider(0, 5, 1, scale || 3, 'outcomeScale' + index);
  }

  valueEvent(val, outcomeObj) {
    outcomeObj.scale = val;
  }

  addOrUpddate(weight, dialogRef?, type?) {}
}
