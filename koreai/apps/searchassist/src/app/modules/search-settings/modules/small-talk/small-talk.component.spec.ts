import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallTalkComponent } from './small-talk.component';

describe('SmallTalkComponent', () => {
  let component: SmallTalkComponent;
  let fixture: ComponentFixture<SmallTalkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmallTalkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallTalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
