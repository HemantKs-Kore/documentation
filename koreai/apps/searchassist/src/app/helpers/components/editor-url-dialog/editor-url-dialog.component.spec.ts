import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorUrlDialogComponent } from './editor-url-dialog.component';

describe('EditorUrlDialogComponent', () => {
  let component: EditorUrlDialogComponent;
  let fixture: ComponentFixture<EditorUrlDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorUrlDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorUrlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
