import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotActionComponent } from './bot-action.component';

describe('BotActionComponent', () => {
  let component: BotActionComponent;
  let fixture: ComponentFixture<BotActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
