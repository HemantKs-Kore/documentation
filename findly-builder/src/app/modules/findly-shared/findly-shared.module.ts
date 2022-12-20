import { RangeSliderModule } from './../../helpers/components/range-slider/range-slider.module';
import { SharedPipesModule } from './../../helpers/filters/shared-pipes.module';
import { KrModalModule } from './../../shared/kr-modal/kr-modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFieldsComponent } from '../../components/search-settings/list-fields/list-fields.component';
import { RangeSliderSearchExperienceComponent } from 'src/app/helpers/components/range-slider-search-experience/range-slider-search-experience.component';
import { TranslateModule } from '@ngx-translate/core';
import { UseronboardingJourneyComponent } from 'src/app/helpers/components/useronboarding-journey/useronboarding-journey.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SearchFilterComponent } from 'src/app/helpers/components/search-filter/search-filter.component';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecordPaginationComponent } from 'src/app/helpers/components/record-pagination/record-pagination.component';
import { SynonymFilterPipe } from '../../components/synonyms/synonym-filter';



@NgModule({
  declarations: [
    ListFieldsComponent,
    RangeSliderSearchExperienceComponent,
    UseronboardingJourneyComponent,
    SearchFilterComponent,
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
    KrModalModule,
    SharedPipesModule,
    RangeSliderModule,
  ],
  exports: [
    ListFieldsComponent,
    RangeSliderSearchExperienceComponent,
    TranslateModule,
    UseronboardingJourneyComponent,
    PerfectScrollbarModule,
    SearchFilterComponent,
    FormsModule,
    NgbTooltipModule,
    MatProgressSpinnerModule,
    NgbDropdownModule,
    RecordPaginationComponent,
    SynonymFilterPipe,
    KrModalModule,
    SharedPipesModule,
    RangeSliderModule,
  ],
})
export class FindlySharedModule {}
