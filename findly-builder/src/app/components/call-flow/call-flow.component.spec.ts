import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallFlowComponent } from './call-flow.component';

describe('CallFlowComponent', () => {
  let component: CallFlowComponent;
  let fixture: ComponentFixture<CallFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
