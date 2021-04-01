import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeSliderSearchExperienceComponent } from './range-slider-search-experience.component';

describe('RangeSliderSearchExperienceComponent', () => {
  let component: RangeSliderSearchExperienceComponent;
  let fixture: ComponentFixture<RangeSliderSearchExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RangeSliderSearchExperienceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeSliderSearchExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
