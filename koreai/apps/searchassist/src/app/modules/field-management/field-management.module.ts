import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldManagementRoutingModule } from './field-management-routing.module';
import { FieldManagementComponent } from './field-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { EmptyScreenModule } from '../empty-screen/empty-screen.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FieldManagementComponent],
  imports: [
    CommonModule,
    FieldManagementRoutingModule,
    TranslateModule,
    KrModalModule,
    NgbDropdownModule,
    SharedPipesModule,
    EmptyScreenModule,
    FormsModule,
  ],
})
export class FieldManagementModule {}
