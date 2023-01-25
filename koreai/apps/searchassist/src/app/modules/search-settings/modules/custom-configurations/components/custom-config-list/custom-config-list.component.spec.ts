import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomConfigListComponent } from './custom-config-list.component';

describe('CustomConfigListComponent', () => {
  let component: CustomConfigListComponent;
  let fixture: ComponentFixture<CustomConfigListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomConfigListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomConfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
