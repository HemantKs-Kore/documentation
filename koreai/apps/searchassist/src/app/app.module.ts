import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { EntityDataModule } from '@ngrx/data';
import { extModules } from '../build-specifics';
import { appReducers } from './store/reducers';
import { metaReducers } from './store/meta-reducers';
import { entityConfig } from './store/entity-metadata';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { globalProviders } from '@kore.services/inteceptors';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxEchartsModule } from 'ngx-echarts';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoaderModule } from './shared/loader/loader.module';
import * as echarts from 'echarts';
import { AppDataResolver } from '@kore.services/resolvers/app.data.resolve';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderModule } from './modules/layout/header/header.module';
import { SideBarService } from '@kore.services/header.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DockStatusService } from '@kore.services/dock.status.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ConvertMDtoHTML } from '@kore.helpers/lib/convertHTML';
import { AccountsDataService } from '@kore.services/dataservices/accounts-data.service';
import { QueryPipelineResolver } from '@kore.services/resolvers/query.pipeline.resolve';
import { AuthGuard } from '@kore.services/auth.guard';
import { SortPipe } from '@kore.helpers/sortPipe/sort-pipe';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FindlySharedModule } from './modules/findly-shared/findly-shared.module';
import { MainMenuModule } from './modules/layout/mainmenu/mainmenu.module';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    LoaderModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FindlySharedModule,
    NgxEchartsModule.forRoot({
      echarts: { init: echarts.init },
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
    NgxDaterangepickerMd.forRoot(),
    HeaderModule,
    MainMenuModule,

    StoreModule.forRoot(appReducers, { metaReducers }),
    StoreRouterConnectingModule.forRoot(),
    extModules,
    EffectsModule.forRoot([]),
    EntityDataModule.forRoot(entityConfig),
  ],
  // tslint:disable-next-line:max-line-length
  entryComponents: [
    // ConfirmationDialogComponent,
    // IndexFieldsComfirmationDialogComponent,
    // ImportFaqsModalComponent,
    // EditorUrlDialogComponent,
  ],
  providers: [
    globalProviders,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
    SortPipe,
    AuthGuard,
    AppDataResolver,
    QueryPipelineResolver,
    AccountsDataService,
    SideBarService,
    NgbActiveModal,
    MatSnackBar,
    ConvertMDtoHTML,
    MatDatepickerModule,
    AppSelectionService,
    DockStatusService,
  ],
  // exports: [NgbdDatepickerRange],
  bootstrap: [AppComponent],
})
export class AppModule {}
