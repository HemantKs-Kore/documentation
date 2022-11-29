import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFieldsComponent } from '../../components/search-settings/list-fields/list-fields.component';
import { RangeSliderComponent } from '../../helpers/components/range-slider/range-slider.component';
import { RangeSliderSearchExperienceComponent } from 'src/app/helpers/components/range-slider-search-experience/range-slider-search-experience.component';
import { TranslateModule } from '@ngx-translate/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { UseronboardingJourneyComponent } from 'src/app/helpers/components/useronboarding-journey/useronboarding-journey.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SearchFilterComponent } from 'src/app/helpers/components/search-filter/search-filter.component';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from 'src/app/helpers/filters/filter.pipe';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecordPaginationComponent } from 'src/app/helpers/components/record-pagination/record-pagination.component';
import { SynonymFilterPipe } from '../../components/synonyms/synonym-filter';



@NgModule({
  declarations: [
    ListFieldsComponent,
    RangeSliderSearchExperienceComponent,
    KRModalComponent,
    UseronboardingJourneyComponent,
    SearchFilterComponent,
    RangeSliderComponent,
    FilterPipe,
    RecordPaginationComponent,
    SynonymFilterPipe,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    PerfectScrollbarModule,
    FormsModule,
    NgbTooltipModule,
    MatProgressSpinnerModule,
    NgbDropdownModule,
  ],
  exports: [
    ListFieldsComponent,
    RangeSliderSearchExperienceComponent,
    RangeSliderSearchExperienceComponent,
    TranslateModule,
    KRModalComponent,
    UseronboardingJourneyComponent,
    PerfectScrollbarModule,
    SearchFilterComponent,
    FormsModule,
    RangeSliderComponent,
    FilterPipe,
    NgbTooltipModule,
    MatProgressSpinnerModule,
    NgbDropdownModule,
    RecordPaginationComponent,
    SynonymFilterPipe,
  ],
})
export class FindlySharedModule {}
