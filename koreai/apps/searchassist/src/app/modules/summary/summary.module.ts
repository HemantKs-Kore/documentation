import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryRoutingModule } from './summary-routing.module';
import { SummaryComponent } from './summary.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { UseronboardingJourneyModule } from '@kore.apps/helpers/components/useronboarding-journey/useronboarding-journey.module';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';

import { QueryPipelineDataService } from './services/query-pipeline-data.service';
import { IndexPipelineDataService } from './services/index-pipeline-data.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// export const indexPipelineFeatureKey = 'indexPipeline';
// export const queryPipelineFeatureKey = 'queryPipeline';

// export const entityMetadata: EntityMetadataMap = {
//   [indexPipelineFeatureKey]: {
//     entityDispatcherOptions: {
//       optimisticUpdate: true,
//     },
//     selectId: (data) => data._id,
//   },
//   [queryPipelineFeatureKey]: {
//     entityDispatcherOptions: {
//       optimisticUpdate: true,
//     },
//     selectId: (data) => data._id,
//   },
// };

@NgModule({
  declarations: [SummaryComponent],
  imports: [
    CommonModule,
    SummaryRoutingModule,
    PerfectScrollbarModule,
    UseronboardingJourneyModule,
    TranslateModule.forChild(),
    SharedPipesModule,
    NgbTooltipModule,
  ],
})
export class SummaryModule {
  // constructor(
  //   private eds: EntityDefinitionService,
  //   private entityDataService: EntityDataService,
  //   private indexPipelineDataService: IndexPipelineDataService,
  //   private queryPipelineDataService: QueryPipelineDataService
  // ) {
  //   this.eds.registerMetadataMap(entityMetadata);
  //   this.entityDataService.registerService(
  //     indexPipelineFeatureKey,
  //     this.indexPipelineDataService
  //   );
  //   this.entityDataService.registerService(
  //     queryPipelineFeatureKey,
  //     this.queryPipelineDataService
  //   );
  // }
}
