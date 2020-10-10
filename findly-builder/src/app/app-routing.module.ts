import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@kore.services/auth.guard';
import { AppDataResolver } from '@kore.services/resolvers/app.data.resolve';
import { AppsListingComponent } from './components/apps-home/apps-home';
import { SummaryComponent } from './components/summary/summary.component';
import { AddSourceComponent } from './components/add-source/add-source.component';
import { ContentSourceComponent } from './components/content-source/content-source.component';
import { FaqSourceComponent } from './components/faq-source/faq-source.component';
import { ManageIntentComponent } from './components/manage-intent/manage-intent.component';
import { SynonymsComponent } from './components/synonyms/synonyms.component';
import { ResultsRulesComponent } from './components/results-rules/results-rules.component';
import { BotActionComponent } from './components/bot-action/bot-action.component';
import { MlThresholdComponent } from './components/ml-threshold/ml-threshold.component';
import { TraitsComponent } from './components/traits/traits.component';
import { AttributesListComponent } from './components/attributes-list/attributes-list.component';
import { IndexComponent } from './components/index/index.component';
import { QueryComponent } from './components/query/query.component';
import { StopWordsComponent }  from './components/stop-words/stop-words.component';
import { WeightsComponent }  from './components/weights/weights.component';
import { ResultRankingComponent } from './components/result-ranking/result-ranking.component';
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
      { path: 'faqsManual', component: ManageIntentComponent },
      { path: 'faqs', component: FaqSourceComponent },
      { path: 'botActions', component: BotActionComponent },
      { path: 'synonyms', component: SynonymsComponent },
      { path: 'ml-threshold', component: MlThresholdComponent },
      { path: 'traits', component: TraitsComponent },
      { path: 'rules', component: ResultsRulesComponent },
      { path: 'attributes', component: AttributesListComponent },
      { path: 'index', component: IndexComponent},
      { path: 'query', component: QueryComponent},
      { path: 'stopWords', component: StopWordsComponent},
      { path: 'weights', component: WeightsComponent},
      { path: 'resultranking', component: ResultRankingComponent},
      { path: '**', component: AppsListingComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
