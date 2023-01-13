import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomConfigFormComponent } from './custom-config-form.component';

describe('CustomConfigFormComponent', () => {
  let component: CustomConfigFormComponent;
  let fixture: ComponentFixture<CustomConfigFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomConfigFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
