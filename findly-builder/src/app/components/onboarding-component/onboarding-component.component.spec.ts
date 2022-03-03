import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingComponentComponent } from './onboarding-component.component';

describe('OnboardingComponentComponent', () => {
  let component: OnboardingComponentComponent;
  let fixture: ComponentFixture<OnboardingComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
