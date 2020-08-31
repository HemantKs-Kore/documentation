import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIntentComponent } from './manage-intent.component';

describe('ManageIntentComponent', () => {
  let component: ManageIntentComponent;
  let fixture: ComponentFixture<ManageIntentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageIntentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageIntentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
