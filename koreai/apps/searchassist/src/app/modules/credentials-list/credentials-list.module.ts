import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CredentialsListRoutingModule } from './credentials-list-routing.module';
import { CredentialsListComponent } from './credentials-list.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedPipesModule } from '@kore.helpers/filters/shared-pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [CredentialsListComponent],
  imports: [
    CommonModule,
    CredentialsListRoutingModule,
    PerfectScrollbarModule,
    SharedPipesModule,
    TranslateModule,
    KrModalModule,
    MatDialogModule,
  ],
})
export class CredentialsListModule {}