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

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    LoaderModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxEchartsModule.forRoot({
      echarts: { init: echarts.init },
    }),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ToastrModule.forRoot({
      timeOut: 5000,
      autoDismiss: false,
      closeButton: true,
    }),
    NgxDaterangepickerMd.forRoot(),
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
    // {
    //   provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    //   useValue: { appearance: 'fill' },
    // },
    // SortPipe,
    // AuthGuard,
    AppDataResolver,
    // QueryPipelineResolver,
    // AccountsDataService,
    // SideBarService,
    // NgbActiveModal,
    MatSnackBar,
    // ConvertMDtoHTML,
    // MatDatepickerModule,
    // AppSelectionService,
    // DockStatusService,
  ],
  // exports: [NgbdDatepickerRange],
  bootstrap: [AppComponent],
})
export class AppModule {}
