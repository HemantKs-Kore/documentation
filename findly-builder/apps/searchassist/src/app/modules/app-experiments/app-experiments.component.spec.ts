import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppExperimentsComponent } from './app-experiments.component';

describe('AppExperimentsComponent', () => {
  let component: AppExperimentsComponent;
  let fixture: ComponentFixture<AppExperimentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppExperimentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppExperimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
