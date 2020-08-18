import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveChatAgentInstructionsComponent } from './live-chat-agent-instructions.component';

describe('LiveChatAgentInstructionsComponent', () => {
  let component: LiveChatAgentInstructionsComponent;
  let fixture: ComponentFixture<LiveChatAgentInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveChatAgentInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveChatAgentInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
