import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {MaterialModule} from './modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilterPipe} from './helpers/filters/filter.pipe';
import { dateFormatPipe} from './helpers/filters/dateformat.pipe';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/content/content.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { IntentPreviewComponent } from './components/intent-preview/intent-preview.component';
import { AccountDetailComponent } from './components/account-detail/account-detail.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
// import { ScrollTrackerDirective } from './components/dashboard-home/dashboard-home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UtteranceOverviewDialog } from './components/intent-preview/intent-preview.component';
import { conversationOverviewDialog } from './components/intent-preview/intent-preview.component';
import { MainmenuComponent } from './components/mainmenu/mainmenu.component';

import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthGuard} from '@kore.services/auth.guard';
import {AuthInterceptor} from '@kore.services/inteceptors/auth-interceptor';
import { AccountsDataService } from '@kore.services/dataservices/accounts-data.service';
import { AppDataResolver} from '@kore.services/resolvers/app.data.resolve';
import { NotificationMessageComponent } from './components/notification-message/notification-message.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { GenerateReportComponent } from './components/generate-report/generate-report.component';
import { InviteSalesComponent } from './components/invite-sales/invite-sales.component';
import { EnterprisePermissionComponent } from './components/enterprise-permission/enterprise-permission.component';
import { NgbdDatepickerRange } from './components/custom-range/datepicker-range';
import { CallFlowComponent } from './components/call-flow/call-flow.component';
import { IvrConfigurationsComponent } from './components/ivr-configurations/ivr-configurations.component';
import { PublishComponent } from './components/publish/publish.component';
import { SideBarService } from '@kore.services/header.service';
import { ToastrModule } from 'ngx-toastr';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { AppsListingComponent } from './components/apps-home/apps-home';
import { FieldTypePipe } from './helpers/filters/field-type.pipe';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { ScrollSpyDirective } from './helpers/directives/scroll-spy.directive';
import { ConfigurationsComponent } from './components/configurations/configurations.component';
import { ManageDeflectionComponent } from './components/manage-deflection/manage-deflection.component';
import { ConfirmationDialogComponent } from './helpers/components/confirmation-dialog/confirmation-dialog.component';
import { LiveChatAgentComponent } from './components/live-chat-agent/live-chat-agent.component';
import { LiveChatAgentInstructionsComponent } from './components/live-chat-agent-instructions/live-chat-agent-instructions.component';
import { CallHistoryComponent } from './components/call-history/call-history.component';
import { SharedModule } from './shared/shared.module';
import { EditFormComponent } from './components/edit-form/edit-form.component';
import { CanDeactivateGuard } from './helpers/guards/can-deactivate-guard.service';
import { ChatHistoryComponent } from './components/chat-history/chat-history.component';
import { CallLogsComponent } from './components/call-logs/call-logs.component';
import { SummaryComponent } from './components/summary/summary.component';
import { ChoosePhoneNumberComponent } from './components/choose-phone-number/choose-phone-number.component';
import { KRModalComponent } from '@kore.shared/kr-modal/kr-modal.component';
import { SourceContentComponent } from './components/source-content/source-content.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    IntentPreviewComponent,
    AccountDetailComponent,
    DashboardHomeComponent,
    MainmenuComponent,
    UtteranceOverviewDialog,
    conversationOverviewDialog,
    FilterPipe,
    dateFormatPipe,
    NotificationMessageComponent,
    GenerateReportComponent,
    InviteSalesComponent,
    EnterprisePermissionComponent,
    NgbdDatepickerRange,
    CallFlowComponent,
    IvrConfigurationsComponent,
    PublishComponent,
    AppsListingComponent,
    FieldTypePipe,
    OnboardingComponent,
    ScrollSpyDirective,
    ConfigurationsComponent,
    ManageDeflectionComponent,
    ConfirmationDialogComponent,
    LiveChatAgentComponent,
    LiveChatAgentInstructionsComponent,
    CallHistoryComponent,
    EditFormComponent,
    ChatHistoryComponent,
    CallLogsComponent,
    SummaryComponent,
    ChoosePhoneNumberComponent,
    KRModalComponent,
    SourceContentComponent,
    ],
  imports: [
    BrowserModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    AngularFontAwesomeModule,
    ReactiveFormsModule,
    DragDropModule,
    PerfectScrollbarModule,
    SharedModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      autoDismiss	: false,
      closeButton : true
    })
  ],
  // tslint:disable-next-line:max-line-length
  entryComponents: [NotificationMessageComponent, ConfirmationDialogComponent, LiveChatAgentInstructionsComponent, ChatHistoryComponent, CallLogsComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthGuard, AppDataResolver, AccountsDataService, SideBarService, CanDeactivateGuard, NgbActiveModal
  ],
  exports: [NgbdDatepickerRange],
  bootstrap: [AppComponent]
})
export class AppModule { }
