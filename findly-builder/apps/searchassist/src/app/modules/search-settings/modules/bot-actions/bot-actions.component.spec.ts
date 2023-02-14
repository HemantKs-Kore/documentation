import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotActionsComponent } from './bot-actions.component';

describe('BotActionsComponent', () => {
  let component: BotActionsComponent;
  let fixture: ComponentFixture<BotActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BotActionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BotActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
