import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAltFaqComponent } from './add-alt-faq.component';

describe('AddAltFaqComponent', () => {
  let component: AddAltFaqComponent;
  let fixture: ComponentFixture<AddAltFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAltFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAltFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
