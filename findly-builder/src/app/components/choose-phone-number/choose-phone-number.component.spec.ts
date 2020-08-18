import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePhoneNumberComponent } from './choose-phone-number.component';

describe('ChoosePhoneNumberComponent', () => {
  let component: ChoosePhoneNumberComponent;
  let fixture: ComponentFixture<ChoosePhoneNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosePhoneNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePhoneNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
