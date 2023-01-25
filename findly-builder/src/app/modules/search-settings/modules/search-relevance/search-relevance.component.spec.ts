import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRelevanceComponent } from './search-relevance.component';

describe('SearchRelevanceComponent', () => {
  let component: SearchRelevanceComponent;
  let fixture: ComponentFixture<SearchRelevanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchRelevanceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRelevanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
