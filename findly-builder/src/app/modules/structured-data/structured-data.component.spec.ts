import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructuredDataComponent } from './structured-data.component';

describe('StructuredDataComponent', () => {
  let component: StructuredDataComponent;
  let fixture: ComponentFixture<StructuredDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StructuredDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StructuredDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
