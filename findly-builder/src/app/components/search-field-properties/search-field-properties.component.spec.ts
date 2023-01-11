import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFieldPropertiesComponent } from './search-field-properties.component';

describe('SearchFieldPropertiesComponent', () => {
  let component: SearchFieldPropertiesComponent;
  let fixture: ComponentFixture<SearchFieldPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchFieldPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFieldPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
