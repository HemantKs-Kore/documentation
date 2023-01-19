import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEngagementComponent } from './user-engagement.component';

describe('UserEngagementComponent', () => {
  let component: UserEngagementComponent;
  let fixture: ComponentFixture<UserEngagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserEngagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEngagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});