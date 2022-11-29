import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchsettingsBotactionsComponent } from './searchsettings-botactions.component';

describe('SearchsettingsBotactionsComponent', () => {
  let component: SearchsettingsBotactionsComponent;
  let fixture: ComponentFixture<SearchsettingsBotactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchsettingsBotactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchsettingsBotactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
