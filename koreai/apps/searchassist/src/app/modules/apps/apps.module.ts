import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppsRoutingModule } from './apps-routing.module';
import { AppsComponent } from './apps.component';
import { TranslateModule } from '@ngx-translate/core';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { SharedPipesModule } from '@kore.helpers/filters/shared-pipes.module';

@NgModule({
  declarations: [AppsComponent],
  imports: [
    CommonModule,
    AppsRoutingModule,
    TranslateModule,
    KrModalModule,
    PerfectScrollbarModule,
    FormsModule,
    SharedPipesModule,
  ],
  exports: [AppsComponent],
})
export class AppsModule {}
