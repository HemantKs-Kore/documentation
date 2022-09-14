import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorsSourceComponent } from './connectors-source.component';

describe('ConnectorsSourceComponent', () => {
  let component: ConnectorsSourceComponent;
  let fixture: ComponentFixture<ConnectorsSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectorsSourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorsSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
