import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellCorrectionComponent } from './spell-correction.component';

describe('SpellCorrectionComponent', () => {
  let component: SpellCorrectionComponent;
  let fixture: ComponentFixture<SpellCorrectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpellCorrectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
