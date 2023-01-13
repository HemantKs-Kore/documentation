import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFaqsModalComponent } from './import-faqs-modal.component';

describe('ImportFaqsModalComponent', () => {
  let component: ImportFaqsModalComponent;
  let fixture: ComponentFixture<ImportFaqsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportFaqsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFaqsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
