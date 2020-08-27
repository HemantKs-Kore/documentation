import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@kore.services/auth.guard';
import { AppDataResolver } from '@kore.services/resolvers/app.data.resolve';
import { AppsListingComponent } from './components/apps-home/apps-home';
import { SummaryComponent } from './components/summary/summary.component';
import { SourceContentComponent } from './components/source-content/source-content.component';
import { ContentSourceComponent } from './components/content-source/content-source.component';
import { FaqSourceComponent } from './components/faq-source/faq-source.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    resolve: {
      appData: AppDataResolver
    },
    children: [
      { path: '', redirectTo: '/apps', pathMatch: 'full' },
      { path: 'apps', component: AppsListingComponent },
      { path: 'summary', component: SummaryComponent },
      { path: 'source', component: SourceContentComponent },
      { path: 'content', component: ContentSourceComponent },
      { path: 'faqs', component: FaqSourceComponent },
      { path: 'botActions', component: SourceContentComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
