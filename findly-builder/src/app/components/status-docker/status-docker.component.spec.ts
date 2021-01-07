import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusDockerComponent } from './status-docker.component';

describe('StatusDockerComponent', () => {
  let component: StatusDockerComponent;
  let fixture: ComponentFixture<StatusDockerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusDockerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusDockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
