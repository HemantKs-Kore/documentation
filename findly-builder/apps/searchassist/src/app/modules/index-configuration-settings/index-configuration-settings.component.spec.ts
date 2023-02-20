import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexConfigurationSettingsComponent } from './index-configuration-settings.component';

describe('IndexConfigurationSettingsComponent', () => {
  let component: IndexConfigurationSettingsComponent;
  let fixture: ComponentFixture<IndexConfigurationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexConfigurationSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexConfigurationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
