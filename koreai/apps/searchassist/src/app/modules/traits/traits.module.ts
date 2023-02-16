import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TraitsRoutingModule } from './traits-routing.module';
import { TraitsComponent } from './traits.component';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { EmptyScreenModule } from '../empty-screen/empty-screen.module';
import { TraitsFilterPipe } from './traits-filter.pipe';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [TraitsComponent, TraitsFilterPipe],
  imports: [
    CommonModule,
    TraitsRoutingModule,
    KrModalModule,
    TranslateModule.forChild(),
    PerfectScrollbarModule,
    FormsModule,
    MatDialogModule,
    EmptyScreenModule,
    NgbTooltipModule,
  ],
})
export class TraitsModule {}
