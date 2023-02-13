import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { AppDataResolver } from './services/resolvers/app.data.resolve';

const routes: Routes = [
  {
    path: 'demo',
    loadChildren: () =>
      import('./modules/demo/demo.module').then((m) => m.DemoModule),
  },
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
        path: 'searchInsights',
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
      {
        path: 'team-management',
        loadChildren: () =>
          import('./modules/team-management/team-management.module').then(
            (m) => m.TeamManagementModule
          ),
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
        path: 'workbench',
        loadChildren: () =>
          import('./modules/workbench/workbench.module').then(
            (m) => m.WorkbenchModule
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('./modules/apps/apps.module').then((m) => m.AppsModule),
        pathMatch: 'full',
      },
      // {
      //   path: 'not-found',
      //   loadChildren: () =>
      //     import(
      //       '@kore.libs/shared/src/lib/modules/not-found/not-found.module'
      //     ).then((m) => m.NotFoundModule),
      // },
      // Fallbak route
      // {
      //   path: '**',
      //   redirectTo: '/not-found',
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
