import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceContentComponent } from './source-content.component';

describe('SourceContentComponent', () => {
  let component: SourceContentComponent;
  let fixture: ComponentFixture<SourceContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
