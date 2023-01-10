import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexFieldsComfirmationDialogComponent } from './index-fields-comfirmation-dialog.component';

describe('IndexFieldsComfirmationDialogComponent', () => {
  let component: IndexFieldsComfirmationDialogComponent;
  let fixture: ComponentFixture<IndexFieldsComfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexFieldsComfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexFieldsComfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
