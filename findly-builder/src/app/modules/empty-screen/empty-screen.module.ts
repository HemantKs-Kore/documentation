import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyScreenComponent } from './empty-screen.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [EmptyScreenComponent],
  imports: [CommonModule, MatProgressSpinnerModule, TranslateModule],
  exports: [EmptyScreenComponent],
})
export class EmptyScreenModule {}
