import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { StructuredDataStatusModalComponent } from './structured-data-status-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [StructuredDataStatusModalComponent],
  imports: [CommonModule, TranslateModule, PerfectScrollbarModule, MatProgressBarModule, NgbTooltipModule],
  exports: [StructuredDataStatusModalComponent],
})
export class StructuredDataStatusModalModule {}
