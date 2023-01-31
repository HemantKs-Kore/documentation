import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacetsRoutingModule } from './facets-routing.module';
import { FacetsComponent } from './facets.component';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { EmptyScreenModule } from '../empty-screen/empty-screen.module';

@NgModule({
  declarations: [FacetsComponent],
  imports: [
    CommonModule,
    FacetsRoutingModule,
    TranslateModule.forChild(),
    PerfectScrollbarModule,
    KrModalModule,
    MatDialogModule,
    SharedPipesModule,
    NgbDropdownModule,
    EmptyScreenModule,
  ],
})
export class FacetsModule {}
