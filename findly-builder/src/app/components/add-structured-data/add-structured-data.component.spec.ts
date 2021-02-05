import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStructuredDataComponent } from './add-structured-data.component';

describe('AddStructuredDataComponent', () => {
  let component: AddStructuredDataComponent;
  let fixture: ComponentFixture<AddStructuredDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStructuredDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStructuredDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
