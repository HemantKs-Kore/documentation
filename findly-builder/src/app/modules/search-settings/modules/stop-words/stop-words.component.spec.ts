import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopWordsComponent } from './stop-words.component';

describe('StopWordsComponent', () => {
  let component: StopWordsComponent;
  let fixture: ComponentFixture<StopWordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StopWordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StopWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
