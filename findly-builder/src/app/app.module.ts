import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilterPipe} from './helpers/filters/filter.pipe';
import { DateFormatPipe} from './helpers/filters/dateformat.pipe';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppBodyComponent } from './components/app-body/app-body.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// import { ScrollTrackerDirective } from './components/dashboard-home/dashboard-home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMenuComponent } from './components/app-menu/app-menu.component';

import {HTTP_INTERCEPTORS } from '@angular/common/http';
import {AuthGuard} from '@kore.services/auth.guard';
import {AuthInterceptor } from '@kore.services/inteceptors/auth-interceptor';
import { AccountsDataService } from '@kore.services/dataservices/accounts-data.service';
import { AppDataResolver} from '@kore.services/resolvers/app.data.resolve';
import { SideBarService } from '@kore.services/header.service';
import { ToastrModule } from 'ngx-toastr';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppsListingComponent } from './components/apps-home/apps-home';
import { ScrollSpyDirective } from './helpers/directives/scroll-spy.directive';
import { ConfirmationDialogComponent } from './helpers/components/confirmation-dialog/confirmation-dialog.component';
import { SharedModule } from './shared/shared.module';
import { SummaryComponent } from './components/summary/summary.component';
import { KRModalComponent } from './shared/kr-modal/kr-modal.component';
import { AddSourceComponent } from './components/add-source/add-source.component';
import { MatMenuModule} from '@angular/material/menu';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentSourceComponent } from './components/content-source/content-source.component';
import { FaqSourceComponent } from './components/faq-source/faq-source.component';
import { ManageIntentComponent } from './components/manage-intent/manage-intent.component';
import { AddFaqComponent } from './components/add-faq/add-faq.component';
import { AddAltFaqComponent } from './components/add-alt-faq/add-alt-faq.component';
import { CustomMarkdownEditorComponent } from './helpers/lib/md-editor.component';
import { MarkdownEditorResizeSensorComponent } from './helpers/lib/resize-sensor/resize-sensor.component';
import { EditorUrlDialogComponent } from './helpers/components/editor-url-dialog/editor-url-dialog.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ImportFaqsModalComponent } from './components/import-faqs-modal/import-faqs-modal.component';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, 'assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppBodyComponent,
    AppMenuComponent,
    FilterPipe,
    DateFormatPipe,
    AppsListingComponent,
    ScrollSpyDirective,
    ConfirmationDialogComponent,
    SummaryComponent,
    KRModalComponent,
    AddSourceComponent,
    ContentSourceComponent,
    FaqSourceComponent,
    ManageIntentComponent,
    AddFaqComponent,
    AddAltFaqComponent,
    CustomMarkdownEditorComponent,
    MarkdownEditorResizeSensorComponent,
    EditorUrlDialogComponent,
    ImportFaqsModalComponent
    ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    DragDropModule,
    PerfectScrollbarModule,
    SharedModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    FileUploadModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
      }
   }),
    ToastrModule.forRoot({
      timeOut: 5000,
      autoDismiss	: false,
      closeButton : true
    })
  ],
  // tslint:disable-next-line:max-line-length
  entryComponents: [ConfirmationDialogComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthGuard, AppDataResolver, AccountsDataService, SideBarService, NgbActiveModal , MatSnackBar
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
