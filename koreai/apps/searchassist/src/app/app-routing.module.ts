import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from '@kore.services/auth.guard';
import { AppDataResolver } from '@kore.services/resolvers/app.data.resolve';
// import { AppsListingComponent } from './components/apps-home/apps-home';
// import { SummaryComponent } from './components/summary/summary.component';
// import { TraitsComponent } from './components/traits/traits.component';
// import { IndexComponent } from './components/index/index.component';
// import { ResultRankingComponent } from './components/result-ranking/result-ranking.component';
// import { FacetsComponent } from './components/facets/facets.component';
// import { MetricsComponent } from './components/metrics/metrics.component';
// import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { UserEngagementComponent } from './components/user-engagement/user-engagement.component';
// import { SearchInsightsComponent } from './components/search-insights/search-insights.component';
// import { ResultInsightsComponent } from './components/result-insights/result-insights.component';
// import { BusinessRulesComponent } from './components/business-rules/business-rules.component';
// import { SettingsComponent } from './components/settings/settings.component';
// import { CredentialsListComponent } from './components/credentials-list/credentials-list.component';
// import { FieldManagementComponent } from './components/field-management/field-management.component';
// import { AppExperimentsComponent } from './components/app-experiments/app-experiments.component';
// import { QueryPipelineResolver } from '@kore.services/resolvers/query.pipeline.resolve';
// import { SearchInterfaceComponent } from './components/search-interface/search-interface.component';
// import { TeamManagementComponent } from './components/team-management/team-management.component';
// import { SearchExperienceComponent } from './components/search-experience/search-experience.component';
// import { ActionsComponent } from './components/actions/actions.component';
// import { PricingComponent } from './components/pricing/pricing.component';
// import { InvoicesComponent } from './components/invoices/invoices.component';
// import { UsageLogComponent } from './components/usage-log/usage-log.component';
// import { GeneralSettingsComponent } from './components/general-settings/general-settings.component';
// import { ResultTemplatesComponent } from './components/result-templates/result-templates.component';
// import { IndexConfigurationSettingsComponent } from './components/index-configuration-settings/index-configuration-settings.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    resolve: {
      appData: AppDataResolver,
    },
    children: [
      {
        path: 'summary',
        loadChildren: () =>
          import('./modules/summary/summary.module').then(
            (m) => m.SummaryModule
          ),
      },
      {
        path: 'traits',
        loadChildren: () =>
          import('./modules/traits/traits.module').then((m) => m.TraitsModule),
      },

      {
        path: 'rules',
        loadChildren: () =>
          import('./modules/business-rules/business-rules.module').then(
            (m) => m.BusinessRulesModule
          ),
      },
      {
        path: 'facets',
        loadChildren: () =>
          import('./modules/facets/facets.module').then((m) => m.FacetsModule),
      },
      {
        path: 'index',
        loadChildren: () =>
          import('./modules/index/index.module').then((m) => m.IndexModule),
      },
      {
        path: 'experiments',
        loadChildren: () =>
          import('./modules/app-experiments/app-experiments.module').then(
            (m) => m.AppExperimentsModule
          ),
      },
      {
        path: 'resultranking',
        loadChildren: () =>
          import('./modules/result-ranking/result-ranking.module').then(
            (m) => m.ResultRankingModule
          ),
      },
      {
        path: 'metrics',
        loadChildren: () =>
          import('./modules/metrics/metrics.module').then(
            (m) => m.MetricsModule
          ),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'userEngagement',
        loadChildren: () =>
          import('./modules/user-engagement/user-engagement.module').then(
            (m) => m.UserEngagementModule
          ),
      },
      {
        path: 'search-insights',
        loadChildren: () =>
          import('./modules/search-insights/search-insights.module').then(
            (m) => m.SearchInsightsModule
          ),
      },
      {
        path: 'resultInsights',
        loadChildren: () =>
          import('./modules/result-insights/result-insights.module').then(
            (m) => m.ResultInsightsModule
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./modules/settings/settings.module').then(
            (m) => m.SettingsModule
          ),
      },
      {
        path: 'credentials-list',
        loadChildren: () =>
          import('./modules/credentials-list/credentials-list.module').then(
            (m) => m.CredentialsListModule
          ),
      },
      {
        path: 'actions',
        loadChildren: () =>
          import('./modules/actions/actions.module').then(
            (m) => m.ActionsModule
          ),
      },
      {
        path: 'generalSettings',
        loadChildren: () =>
          import('./modules/general-settings/general-settings.module').then(
            (m) => m.GeneralSettingsModule
          ),
      },
      {
        path: 'FieldManagementComponent',
        loadChildren: () =>
          import('./modules/field-management/field-management.module').then(
            (m) => m.FieldManagementModule
          ),
      },
      {
        path: 'resultTemplate',
        loadChildren: () =>
          import('./modules/result-templates/result-templates.module').then(
            (m) => m.ResultTemplatesModule
          ),
      },
      {
        path: 'search-experience',
        loadChildren: () =>
          import('./modules/search-experience/search-experience.module').then(
            (m) => m.SearchExperienceModule
          ),
      },
      {
        path: 'invoices',
        loadChildren: () =>
          import('./modules/invoices/invoices.module').then(
            (m) => m.InvoicesModule
          ),
      },
      {
        path: 'usageLog',
        loadChildren: () =>
          import('./modules/usage-log/usage-log.module').then(
            (m) => m.UsageLogModule
          ),
      },
      {
        path: 'index-configuration-settings',
        loadChildren: () =>
          import(
            './modules/index-configuration-settings/index-configuration-settings.module'
          ).then((m) => m.IndexConfigurationSettingsModule),
      },
      // { path: 'pricing', component: PricingComponent },
      //   path: 'index-configuration-settings',
      //   component: IndexConfigurationSettingsComponent,
      // },
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
          import('./modules/content/content.module').then(
            (m) => m.ContentModule
          ),
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
      {
        path: 'demo',
        loadChildren: () =>
          import('./modules/demo/demo.module').then((m) => m.DemoModule),
      },

      {
        path: '',
        loadChildren: () =>
          import('./modules/apps/apps.module').then((m) => m.AppsModule),
        pathMatch: 'full',
      },
      // { path: '**', redirectTo: 'apps' },
    ],
  },
  {
    path: 'team-management',
    loadChildren: () =>
      import('./modules/team-management/team-management.module').then(
        (m) => m.TeamManagementModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
