import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqSourceComponent } from './faq-source.component';

describe('FaqSourceComponent', () => {
  let component: FaqSourceComponent;
  let fixture: ComponentFixture<FaqSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
