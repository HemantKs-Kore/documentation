import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@kore.services/auth.guard';
import { AppDataResolver } from '@kore.services/resolvers/app.data.resolve';
import { AppsListingComponent } from './components/apps-home/apps-home';
import { SummaryComponent } from './components/summary/summary.component';
import { TraitsComponent } from './components/traits/traits.component';
import { IndexComponent } from './components/index/index.component';
import { SearchFieldPropertiesComponent } from './components/search-field-properties/search-field-properties.component';
import { ResultRankingComponent } from './components/result-ranking/result-ranking.component';
import { FacetsComponent } from './components/facets/facets.component';
import { MetricsComponent } from './components/metrics/metrics.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserEngagementComponent } from './components/user-engagement/user-engagement.component';
import { SearchInsightsComponent } from './components/search-insights/search-insights.component';
import { ResultInsightsComponent } from './components/result-insights/result-insights.component';
import { BusinessRulesComponent } from './components/business-rules/business-rules.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CredentialsListComponent } from './components/credentials-list/credentials-list.component';
import { FieldManagementComponent } from './components/field-management/field-management.component';
import { AppExperimentsComponent } from './components/app-experiments/app-experiments.component';
import { QueryPipelineResolver } from '@kore.services/resolvers/query.pipeline.resolve';
import { SearchInterfaceComponent } from './components/search-interface/search-interface.component';
import { TeamManagementComponent } from './components/team-management/team-management.component';
import { SearchExperienceComponent } from './components/search-experience/search-experience.component';
import { ActionsComponent } from './components/actions/actions.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { UsageLogComponent } from './components/usage-log/usage-log.component';
import { GeneralSettingsComponent } from './components/general-settings/general-settings.component';
import { ResultTemplatesComponent } from './components/result-templates/result-templates.component';
import { IndexConfigurationSettingsComponent } from './components/index-configuration-settings/index-configuration-settings.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    resolve: {
      appData: AppDataResolver,
    },
    children: [
      { path: 'apps', component: AppsListingComponent },
      { path: 'summary', component: SummaryComponent },
      // { path: 'content', component: ContentSourceComponent },
      // { path: 'faqs', component: FaqSourceComponent },
      // { path: 'connectors', component: ConnectorsSourceComponent },
      // { path: 'botActions', component: BotActionComponent },
      { path: 'traits', component: TraitsComponent },
      { path: 'rules', component: BusinessRulesComponent },
      { path: 'facets', component: FacetsComponent },
      { path: 'index', component: IndexComponent },
      { path: 'experiments', component: AppExperimentsComponent },
      { path: 'resultranking', component: ResultRankingComponent },
      { path: 'metrics', component: MetricsComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'userEngagement', component: UserEngagementComponent },
      { path: 'searchInsights', component: SearchInsightsComponent },
      { path: 'resultInsights', component: ResultInsightsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'credentials-list', component: CredentialsListComponent },
      { path: 'actions', component: ActionsComponent },
      { path: 'generalSettings', component: GeneralSettingsComponent },
      { path: 'FieldManagementComponent', component: FieldManagementComponent },
      { path: 'resultTemplate', component: ResultTemplatesComponent },
      // { path: 'structuredData', component: StructuredDataComponent },
      { path: 'team-management', component: TeamManagementComponent },
      { path: 'search-experience', component: SearchExperienceComponent },
      { path: 'pricing', component: PricingComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'usageLog', component: UsageLogComponent },
      // { path: 'search-field-properties', component: SearchSettingsComponent },
      // { path: 'search-field-properties', component: SearchFieldPropertiesComponent },
      {
        path: 'index-configuration-settings',
        component: IndexConfigurationSettingsComponent,
      },
      {
        path: 'search-settings',
        loadChildren: () =>
          import('./modules/search-settings/search-settings.module').then(
            (m) => m.SearchSettingsModule
          ),
      },
      {
        path: 'sources',
        loadChildren: () =>
          import('./modules/sources/sources.module').then(
            (m) => m.SourcesModule
          ),
      },
      {
        path: 'content',
        loadChildren: () =>
          import('./modules/content/content.module').then((m) => m.ContentModule),
      },
      {
        path: 'faqs',
        loadChildren: () =>
          import('./modules/faqs/faqs.module').then((m) => m.FaqsModule),
      },
      {
        path: 'connectors',
        loadChildren: () =>
          import('./modules/connectors/connectors.module').then(
            (m) => m.ConnectorsModule
          ),
      },
      {
        path: 'botActions',
        loadChildren: () =>
          import('./modules/bot-actions/bot-actions.module').then(
            (m) => m.BotActionsModule
          ),
      },
      {
        path: 'structuredData',
        loadChildren: () =>
          import('./modules/structured-data/structured-data.module').then(
            (m) => m.StructuredDataModule
          ),
      },

      { path: '', component: AppsListingComponent, pathMatch: 'full' },
      { path: '**', component: AppsListingComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
