import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSdkComponent } from './search-sdk.component';

describe('SearchSdkComponent', () => {
  let component: SearchSdkComponent;
  let fixture: ComponentFixture<SearchSdkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchSdkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchSdkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
