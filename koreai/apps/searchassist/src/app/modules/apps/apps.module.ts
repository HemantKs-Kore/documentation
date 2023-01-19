import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppsRoutingModule } from './apps-routing.module';
import { AppsComponent } from './apps.component';
import { TranslateModule } from '@ngx-translate/core';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { SharedPipesModule } from '@kore.helpers/filters/shared-pipes.module';
import { EmptyScreenModule } from '../empty-screen/empty-screen.module';

// AoT requires an exported function for factories
// export function createTranslateLoader(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/home/', '.json');
// }

@NgModule({
  declarations: [AppsComponent],
  imports: [
    CommonModule,
    AppsRoutingModule,
    TranslateModule.forChild({
      // useDefaultLang: true,
      // loader: {
      //   provide: TranslateLoader,
      //   useFactory: createTranslateLoader,
      //   deps: [HttpClient],
      // },
      // isolate: true,
    }),
    KrModalModule,
    PerfectScrollbarModule,
    FormsModule,
    SharedPipesModule,
    EmptyScreenModule,
  ],
  exports: [AppsComponent],
})
export class AppsModule {}
