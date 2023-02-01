import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamManagementRoutingModule } from './team-management-routing.module';
import { TeamManagementComponent } from './team-management.component';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatChipsModule } from '@angular/material/chips';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EmptyScreenModule } from '../empty-screen/empty-screen.module';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    './assets/i18n/team-management/',
    '.json'
  );
}

@NgModule({
  declarations: [TeamManagementComponent],
  imports: [
    CommonModule,
    TeamManagementRoutingModule,
    KrModalModule,
    TranslateModule.forChild({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
    MatFormFieldModule,
    FormsModule,
    NgbTypeaheadModule,
    FormsModule,
    MatFormFieldModule,
    PerfectScrollbarModule,
    MatChipsModule,
    ReactiveFormsModule,
    SharedPipesModule,
    EmptyScreenModule,
  ],
})
export class TeamManagementModule {}
