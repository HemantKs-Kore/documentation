import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CredentialsListRoutingModule } from './credentials-list-routing.module';
import { CredentialsListComponent } from './credentials-list.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { EmptyScreenModule } from '../empty-screen/empty-screen.module';
import { FormsModule } from '@angular/forms';

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
    EmptyScreenModule,
    FormsModule,
  ],
})
export class CredentialsListModule {}
