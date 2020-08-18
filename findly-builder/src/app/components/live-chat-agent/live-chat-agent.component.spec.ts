import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveChatAgentComponent } from './live-chat-agent.component';

describe('LiveChatAgentComponent', () => {
  let component: LiveChatAgentComponent;
  let fixture: ComponentFixture<LiveChatAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveChatAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveChatAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
