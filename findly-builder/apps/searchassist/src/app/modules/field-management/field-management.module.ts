import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldManagementRoutingModule } from './field-management-routing.module';
import { FieldManagementComponent } from './field-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { EmptyScreenModule } from '../empty-screen/empty-screen.module';
import { FormsModule } from '@angular/forms';
import { IndexFieldsComfirmationDialogComponent } from '@kore.apps/helpers/components/index-fields-comfirmation-dialog/index-fields-comfirmation-dialog.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RecordPaginationModule } from '@kore.apps/helpers/components/record-pagination/record-pagination.module';

@NgModule({
  declarations: [
    FieldManagementComponent,
    IndexFieldsComfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    FieldManagementRoutingModule,
    TranslateModule,
    KrModalModule,
    NgbDropdownModule,
    SharedPipesModule,
    EmptyScreenModule,
    FormsModule,
    NgbTooltipModule,
    PerfectScrollbarModule,
    RecordPaginationModule,
  ],
})
export class FieldManagementModule {}
