import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldManagementRoutingModule } from './field-management-routing.module';
import { FieldManagementComponent } from './field-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';

@NgModule({
  declarations: [FieldManagementComponent],
  imports: [
    CommonModule,
    FieldManagementRoutingModule,
    TranslateModule,
    KrModalModule,
  ],
})
export class FieldManagementModule {}
