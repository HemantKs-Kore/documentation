import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsRulesComponent } from './results-rules.component';

describe('ResultsRulesComponent', () => {
  let component: ResultsRulesComponent;
  let fixture: ComponentFixture<ResultsRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
