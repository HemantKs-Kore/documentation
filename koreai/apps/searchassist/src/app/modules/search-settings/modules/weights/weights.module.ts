import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeightsRoutingModule } from './weights-routing.module';
import { WeightsComponent } from './weights.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {HttpClient } from '@angular/common/http';

import { FindlySharedModule } from '../../modules/findly-shared/findly-shared.module';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [WeightsComponent ],
  imports: [
    CommonModule,
    WeightsRoutingModule,
    FindlySharedModule,
    TranslateModule.forChild({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      }
    }),
  ]
})
export class WeightsModule { }
