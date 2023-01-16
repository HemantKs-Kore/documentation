import { PipelineDataResolver } from './../../services/resolvers/pipeline-data.resolve';
import { PipelineResolver } from '../../services/resolvers/pipeline-data.resolve';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchSettingsRoutingModule } from './search-settings-routing.module';
import { SearchSettingsComponent } from './search-settings.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [SearchSettingsComponent],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    SearchSettingsRoutingModule,
    NgbModule
  ],
  providers: [
    PipelineDataResolver,
    PipelineResolver
  ]
})
export class SearchSettingsModule { }
