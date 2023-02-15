import { PipelineDataResolver } from './../../services/resolvers/pipeline-data.resolve';
import { PipelineResolver } from '../../services/resolvers/pipeline-data.resolve';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchSettingsRoutingModule } from './search-settings-routing.module';
import { SearchSettingsComponent } from './search-settings.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowService } from '@kore.apps/services/workflow.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SearchSettingsComponent],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    SearchSettingsRoutingModule,
    NgbModule,
    TranslateModule.forChild(),
  ],
  providers: [
    PipelineDataResolver,
    PipelineResolver,
    WorkflowService,
    ServiceInvokerService,
  ],
})
export class SearchSettingsModule {}
