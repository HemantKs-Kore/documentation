import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorInputComponent } from './connector-input.component';

describe('ConnectorInputComponent', () => {
  let component: ConnectorInputComponent;
  let fixture: ComponentFixture<ConnectorInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectorInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectorInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
