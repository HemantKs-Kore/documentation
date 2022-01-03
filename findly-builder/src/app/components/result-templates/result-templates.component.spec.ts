import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultTemplatesComponent } from './result-templates.component';

describe('ResultTemplatesComponent', () => {
  let component: ResultTemplatesComponent;
  let fixture: ComponentFixture<ResultTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultTemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
