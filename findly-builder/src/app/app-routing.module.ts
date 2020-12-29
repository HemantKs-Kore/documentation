import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@kore.services/auth.guard';
import { AppDataResolver } from '@kore.services/resolvers/app.data.resolve';
import { AppsListingComponent } from './components/apps-home/apps-home';
import { SummaryComponent } from './components/summary/summary.component';
import { AddSourceComponent } from './components/add-source/add-source.component';
import { ContentSourceComponent } from './components/content-source/content-source.component';
import { FaqSourceComponent } from './components/faq-source/faq-source.component';
import { SynonymsComponent } from './components/synonyms/synonyms.component';
import { BotActionComponent } from './components/bot-action/bot-action.component';
import { TraitsComponent } from './components/traits/traits.component';
import { IndexComponent } from './components/index/index.component';
import { StopWordsComponent }  from './components/stop-words/stop-words.component';
import { WeightsComponent }  from './components/weights/weights.component';
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
import { ExperimentsComponent } from './components/experiments/experiments.component';
import { AppExperimentsComponent } from './components/app-experiments/app-experiments.component';
import { QueryPipelineResolver } from '@kore.services/resolvers/query.pipeline.resolve';
const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    resolve: {
      appData: AppDataResolver
    },
    children: [
      { path: '', component: AppsListingComponent, pathMatch: 'full'},
      { path: 'apps', component: AppsListingComponent },
      { path: 'summary', component: SummaryComponent },
      { path: 'source', component: AddSourceComponent },
      { path: 'content', component: ContentSourceComponent },
      { path: 'faqs', component: FaqSourceComponent },
      { path: 'botActions', component: BotActionComponent },
      { path: 'synonyms', component: SynonymsComponent},
      { path: 'traits', component: TraitsComponent },
      { path: 'rules', component: BusinessRulesComponent},
      { path: 'facets', component: FacetsComponent},
      { path: 'index', component: IndexComponent},
      { path: 'experiments', component: AppExperimentsComponent},
      { path: 'stopWords', component: StopWordsComponent},
      { path: 'weights', component: WeightsComponent},
      { path: 'resultranking', component: ResultRankingComponent},
      { path: 'metrics', component: MetricsComponent},
      { path: 'dashboard', component: DashboardComponent},
      { path: 'userEngagement', component: UserEngagementComponent},
      { path: 'searchInsights', component: SearchInsightsComponent},
      { path: 'resultInsights', component: ResultInsightsComponent},
      { path: 'settings', component: SettingsComponent},
      { path: 'credentials-list', component: CredentialsListComponent},
      { path: 'FieldManagementComponent', component: FieldManagementComponent},
      { path: 'experiments', component: ExperimentsComponent},
      { path: '**', component: AppsListingComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
