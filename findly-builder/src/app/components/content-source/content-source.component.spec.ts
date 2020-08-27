import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentSourceComponent } from './content-source.component';

describe('ContentSourceComponent', () => {
  let component: ContentSourceComponent;
  let fixture: ComponentFixture<ContentSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
