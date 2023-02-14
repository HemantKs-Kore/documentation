import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordPaginationComponent } from './record-pagination.component';

describe('RecordPaginationComponent', () => {
  let component: RecordPaginationComponent;
  let fixture: ComponentFixture<RecordPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordPaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
