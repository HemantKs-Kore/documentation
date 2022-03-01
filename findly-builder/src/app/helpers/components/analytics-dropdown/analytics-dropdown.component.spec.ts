import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsDropdownComponent } from './analytics-dropdown.component';

describe('AnalyticsDropdownComponent', () => {
  let component: AnalyticsDropdownComponent;
  let fixture: ComponentFixture<AnalyticsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticsDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
