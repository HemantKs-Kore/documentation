import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentableComponent } from './presentable.component';

describe('PresentableComponent', () => {
  let component: PresentableComponent;
  let fixture: ComponentFixture<PresentableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
