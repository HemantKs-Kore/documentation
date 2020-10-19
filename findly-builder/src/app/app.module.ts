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
import { ConvertMDtoHTML } from './helpers/lib/convertHTML';
import { MarkdownEditorResizeSensorComponent } from './helpers/lib/resize-sensor/resize-sensor.component';
import { EditorUrlDialogComponent } from './helpers/components/editor-url-dialog/editor-url-dialog.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ImportFaqsModalComponent } from './components/import-faqs-modal/import-faqs-modal.component';
import { SynonymsComponent } from './components/synonyms/synonyms.component';
import { SynonymFilterPipe } from './components/synonyms/synonym-filter';
import { ResultsRulesComponent } from './components/results-rules/results-rules.component';
import { BotActionComponent } from './components/bot-action/bot-action.component';
import { TraitsComponent } from './components/traits/traits.component';
import { TraitsFilterPipe } from './components/traits/traits-filter.pipe';
import { MlThresholdComponent } from './components/ml-threshold/ml-threshold.component';
import { AddAlternateQuestionComponent } from './components/faqs/add-alternate-question/add-alternate-question.component';
import { GroupInputComponent } from './components/faqs/group-input/group-input.component';
import { TagsInpComponent } from './components/faqs/tags-inp/tags-inp.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { RangeSliderComponent } from './helpers/components/range-slider/range-slider.component';
import { AttributesListComponent } from './components/attributes-list/attributes-list.component';
import { AutocompleteMultiChipComponent } from './helpers/components/autocomplete-multi-chip/autocomplete-multi-chip.component';
import { IndexComponent } from './components/index/index.component';
import { FieldsFilterPipe } from './components/index/fileds-filter.pipe';
import { QueryComponent } from './components/query/query.component';
import { RulesTableComponent } from './components/results-rules/rules-table/rules-table.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { AnnotoolModule } from './components/annotool/annotool.module';
import { InsightsComponent } from './components/insights/insights.component';
import { PaginationComponent } from './helpers/components/pagination/pagination.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { StopWordsComponent } from './components/stop-words/stop-words.component';
import { WeightsComponent } from './components/weights/weights.component';
import { ResultRankingComponent } from './components/result-ranking/result-ranking.component';
import { AddResultComponent } from './components/add-result/add-result.component';
import { FacetsComponent } from './components/facets/facets.component';
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
    // KRModalComponent, /* Added in shared module*/
    AddSourceComponent,
    ContentSourceComponent,
    FaqSourceComponent,
    ManageIntentComponent,
    AddFaqComponent,
    AddAltFaqComponent,
    CustomMarkdownEditorComponent,
    MarkdownEditorResizeSensorComponent,
    EditorUrlDialogComponent,
    ImportFaqsModalComponent,
    SynonymsComponent,
    BotActionComponent,
    TraitsComponent,
    MlThresholdComponent,
    ResultsRulesComponent,
    BotActionComponent,
    AddAlternateQuestionComponent,
    GroupInputComponent,
    TagsInpComponent,
    RangeSliderComponent,
    AttributesListComponent,
    AutocompleteMultiChipComponent,
    IndexComponent,
    QueryComponent,
    RulesTableComponent,
    SchedulerComponent,
    InsightsComponent,
    PaginationComponent,
    StopWordsComponent,
    WeightsComponent,
    ResultRankingComponent,
    SynonymFilterPipe,
    AddResultComponent,
    FacetsComponent,
    FieldsFilterPipe,
    TraitsFilterPipe
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
    CodemirrorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AnnotoolModule,
    NgxEchartsModule.forRoot({
      echarts: { init: echarts.init }
    }),
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
  entryComponents: [ConfirmationDialogComponent, ImportFaqsModalComponent, EditorUrlDialogComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthGuard, AppDataResolver, AccountsDataService, SideBarService, NgbActiveModal , MatSnackBar , ConvertMDtoHTML, MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
