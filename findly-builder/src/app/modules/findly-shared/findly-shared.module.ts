import { RecordPaginationModule } from './../../helpers/components/record-pagination/record-pagination.module';
import { UseronboardingJourneyModule } from './../../helpers/components/useronboarding-journey/useronboarding-journey.module';
import { RangeSliderModule } from './../../helpers/components/range-slider/range-slider.module';
import { SharedPipesModule } from './../../helpers/filters/shared-pipes.module';
import { KrModalModule } from './../../shared/kr-modal/kr-modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFieldsComponent } from '../../components/search-settings/list-fields/list-fields.component';
import { RangeSliderSearchExperienceComponent } from 'src/app/helpers/components/range-slider-search-experience/range-slider-search-experience.component';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SearchFilterComponent } from 'src/app/helpers/components/search-filter/search-filter.component';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SynonymFilterPipe } from '../../components/synonyms/synonym-filter';



@NgModule({
  declarations: [
    ListFieldsComponent,
    RangeSliderSearchExperienceComponent,
    SearchFilterComponent,
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
    KrModalModule,
    SharedPipesModule,
    RangeSliderModule,
    UseronboardingJourneyModule,
    RecordPaginationModule,
  ],
  exports: [
    ListFieldsComponent,
    RangeSliderSearchExperienceComponent,
    TranslateModule,
    PerfectScrollbarModule,
    SearchFilterComponent,
    FormsModule,
    NgbTooltipModule,
    MatProgressSpinnerModule,
    NgbDropdownModule,
    SynonymFilterPipe,
    KrModalModule,
    SharedPipesModule,
    RangeSliderModule,
    UseronboardingJourneyModule,
    RecordPaginationModule,
  ],
})
export class FindlySharedModule {}