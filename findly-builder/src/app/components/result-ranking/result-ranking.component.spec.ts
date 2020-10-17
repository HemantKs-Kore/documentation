import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultRankingComponent } from './result-ranking.component';

describe('ResultRankingComponent', () => {
  let component: ResultRankingComponent;
  let fixture: ComponentFixture<ResultRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultRankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
