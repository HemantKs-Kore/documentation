import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { AppsRoutingModule } from './apps-routing.module';
import { AppsComponent } from './apps.component';
import { TranslateModule } from '@ngx-translate/core';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { EmptyScreenModule } from '../empty-screen/empty-screen.module';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { IntersectionObserverDirectiveModule } from '@kore.libs/shared/src';
// import {
//   EntityDataService,
//   EntityDefinitionService,
//   EntityMetadataMap,
// } from '@ngrx/data';
// import { AppsDataService } from './services/apps-data.service';
// import { AppsService } from './services/apps.service';

// AoT requires an exported function for factories
// export function createTranslateLoader(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/home/', '.json');
// }

// export const appsFeatureKey = 'apps';
// export const entityMetadata: EntityMetadataMap = {
//   [appsFeatureKey]: {
//     entityDispatcherOptions: {
//       optimisticUpdate: true,
//     },
//     selectId: (data) => data._id,
//     // sortComparer: sort
//   },
// };

@NgModule({
  declarations: [AppsComponent],
  imports: [
    CommonModule,
    AppsRoutingModule,
    TranslateModule.forChild(),
    KrModalModule,
    PerfectScrollbarModule,
    FormsModule,
    SharedPipesModule,
    EmptyScreenModule,
    NgOptimizedImage,
    NgbTooltipModule,
    IntersectionObserverDirectiveModule,
  ],
  // providers: [AppsDataService],
})
export class AppsModule {
  // constructor(
  //   private eds: EntityDefinitionService,
  //   private entityDataService: EntityDataService,
  //   private appsDataService: AppsDataService
  // ) {
  //   this.eds.registerMetadataMap(entityMetadata);
  //   this.entityDataService.registerService(
  //     appsFeatureKey,
  //     this.appsDataService
  //   );
  // }
}
