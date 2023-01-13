import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructuredDataStatusModalComponent } from './structured-data-status-modal.component';

describe('StructuredDataStatusModalComponent', () => {
  let component: StructuredDataStatusModalComponent;
  let fixture: ComponentFixture<StructuredDataStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StructuredDataStatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StructuredDataStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
