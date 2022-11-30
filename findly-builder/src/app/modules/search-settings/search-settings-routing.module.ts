import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchSettingsComponent } from './search-settings.component';

const routes: Routes = [
  {
    path: '',
    component: SearchSettingsComponent,
    children: [
      {
        path: 'weights',
        loadChildren: () =>
          import('./modules/weights/weights.module').then(
            (m) => m.WeightsModule
          ),
      },
      {
        path: 'presentable',
        loadChildren: () =>
          import('./modules/presentable/presentable.module').then(
            (m) => m.PresentableModule
          ),
      },
      {
        path: 'highlighting',
        loadChildren: () =>
          import('./modules/highlighting/highlighting.module').then(
            (m) => m.HighlightingModule
          ),
      },
      {
        path: 'spell_correction',
        loadChildren: () =>
          import('./modules/spell-correction/spell-correction.module').then(
            (m) => m.SpellCorrectionModule
          ),
      },
      {
        path: 'snippets',
        loadChildren: () =>
          import('./modules/snippets/snippets.module').then(
            (m) => m.SnippetsModule
          ),
      },
      {
        path: 'synonyms',
        loadChildren: () =>
          import('./modules/synonyms/synonyms.module').then(
            (m) => m.SynonymsModule
          ),
      },
      {
        path: 'stop_words',
        loadChildren: () =>
          import('./modules/stop-words/stop-words.module').then(
            (m) => m.StopWordsModule
          ),
      },
      {
        path: 'bot_actions',
        loadChildren: () =>
          import('./modules/bot-actions/bot-actions.module').then(
            (m) => m.BotActionsModule
          ),
      },
      {
        path: 'small_talk',
        loadChildren: () =>
          import('./modules/small-talk/small-talk.module').then(
            (m) => m.SmallTalkModule
          ),
      },
      {
        path: 'custom_configurations',
        loadChildren: () =>
          import(
            './modules/custom-configurations/custom-configurations.module'
          ).then((m) => m.CustomConfigurationsModule),
      },
      {
        path: 'search_relevance',
        loadChildren: () =>
          import('./modules/search-relevance/search-relevance.module').then(
            (m) => m.SearchRelevanceModule
          ),
      },
      // {
      //   path: '',
      //   redirectTo: 'weights',
      //   pathMatch: 'full',
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchSettingsRoutingModule { }
