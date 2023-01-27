import { KRModalComponent } from './kr-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [KRModalComponent],
  imports: [CommonModule],
  exports: [KRModalComponent],
  providers: [NgbActiveModal],
})
export class KrModalModule {}
