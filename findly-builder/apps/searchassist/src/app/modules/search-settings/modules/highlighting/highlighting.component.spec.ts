import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightingComponent } from './highlighting.component';

describe('HighlightingComponent', () => {
  let component: HighlightingComponent;
  let fixture: ComponentFixture<HighlightingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighlightingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
