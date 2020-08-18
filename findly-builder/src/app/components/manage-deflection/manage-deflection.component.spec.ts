import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDeflectionComponent } from './manage-deflection.component';

describe('ManageDeflectionComponent', () => {
  let component: ManageDeflectionComponent;
  let fixture: ComponentFixture<ManageDeflectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDeflectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDeflectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
