import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TraitsRoutingModule } from './traits-routing.module';
import { TraitsComponent } from './traits.component';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [TraitsComponent],
  imports: [
    CommonModule,
    TraitsRoutingModule,
    KrModalModule,
    TranslateModule,
    PerfectScrollbarModule,
    FormsModule,
    MatDialogModule,
  ],
})
export class TraitsModule {}
