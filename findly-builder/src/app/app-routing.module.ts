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
import { BotActionComponent } from './components/bot-action/bot-action.component';

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
      { path: '**', component: AppsListingComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
