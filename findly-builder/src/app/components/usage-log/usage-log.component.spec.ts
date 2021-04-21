import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageLogComponent } from './usage-log.component';

describe('UsageLogComponent', () => {
  let component: UsageLogComponent;
  let fixture: ComponentFixture<UsageLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsageLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
