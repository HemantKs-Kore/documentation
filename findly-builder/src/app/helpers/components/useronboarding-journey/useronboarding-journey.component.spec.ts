import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseronboardingJourneyComponent } from './useronboarding-journey.component';

describe('UseronboardingJourneyComponent', () => {
  let component: UseronboardingJourneyComponent;
  let fixture: ComponentFixture<UseronboardingJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseronboardingJourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseronboardingJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
