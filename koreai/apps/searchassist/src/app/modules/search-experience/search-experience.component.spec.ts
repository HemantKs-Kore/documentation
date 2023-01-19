import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchExperienceComponent } from './search-experience.component';

describe('SearchExperienceComponent', () => {
  let component: SearchExperienceComponent;
  let fixture: ComponentFixture<SearchExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchExperienceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
