import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { extModules } from '../build-specifics';
import { appReducers } from './store/reducers';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, isDevMode, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { globalProviders } from '@kore.services/inteceptors';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoaderModule } from './shared/loader/loader.module';
import { AppDataResolver } from '@kore.services/resolvers/app.data.resolve';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderModule } from './modules/layout/header/header.module';
import { AuthGuard } from '@kore.services/auth.guard';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppEffects } from './store/app.effects';
import { appsFeatureKey, entityMetadata } from './store/entity-metadata';
import {
  EntityDataModule,
  EntityDataService,
  EntityDefinitionService,
} from '@ngrx/data';
import { AppsDataService } from './modules/apps/services/apps-data.service';
import { MatDialogModule } from '@angular/material/dialog';
import { AppsModule } from './modules/apps/apps.module';
import { getLoginRedirectURL } from '@kore.libs/shared/src';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function appInitializer() {
  const isAuthenticated = localStorage.jStorage;
  if (!isAuthenticated) {
    // redirect to the login page
    return window.location.protocol + '//' + window.location.host + '/accounts';
  }
  return isAuthenticated;
  // return () => {
  //   // check if the user is authenticated
  //   const isAuthenticated = localStorage.jStorage;
  //   if (!isAuthenticated) {
  //     // redirect to the login page
  //     return (
  //       window.location.protocol + '//' + window.location.host + '/accounts'
  //     );
  //   }
  //   return isAuthenticated;
  // };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    LoaderModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppsModule,
    HttpClientModule,
    CommonModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      extend: true,
    }),
    ToastrModule.forRoot({
      timeOut: 5000,
      autoDismiss: false,
      closeButton: true,
    }),
    HeaderModule,
    MatDialogModule,

    // StoreModule.forRoot(appReducers, { metaReducers }),
    StoreModule.forRoot(appReducers),
    StoreRouterConnectingModule.forRoot(),
    extModules,
    EffectsModule.forRoot([AppEffects]),
    // InsightsModule,
    EntityDataModule.forRoot(entityMetadata),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [],
    },
    globalProviders,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
    AuthGuard,
    AppDataResolver,
    MatSnackBar,
    AppsDataService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private eds: EntityDefinitionService,
    private entityDataService: EntityDataService,
    private appsDataService: AppsDataService
  ) {
    this.eds.registerMetadataMap(entityMetadata);
    this.entityDataService.registerService(
      appsFeatureKey,
      this.appsDataService
    );
    // this.entityDataService.registerService(
    //   indexPipelineFeatureKey,
    //   this.indexPipelineDataService
    // );
    // this.entityDataService.registerService(
    //   queryPipelineFeatureKey,
    //   this.queryPipelineDataService
    // );
  }
}
