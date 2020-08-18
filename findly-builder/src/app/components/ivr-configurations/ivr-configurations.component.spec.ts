import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IvrConfigurationsComponent } from './ivr-configurations.component';

describe('IvrConfigurationsComponent', () => {
  let component: IvrConfigurationsComponent;
  let fixture: ComponentFixture<IvrConfigurationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IvrConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IvrConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
