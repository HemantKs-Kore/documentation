import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-settings',
  templateUrl: './search-settings.component.html',
  styleUrls: ['./search-settings.component.scss']
})
export class SearchSettingsComponent implements OnInit {
  selectedComponent: String = 'weights';
  componentsArray: Array<Object> = [
    { key: 'Weights', value: 'weights' },
    { key: 'Presentable', value: 'presentable' },
    { key: 'Highlighting', value: 'highlighting' },
    { key: 'Spell Correction', value: 'spell_correction' },
    { key: 'Snippets', value: 'snippets' },
    { key: 'Search Relevance', value: 'search_relevance' },
    { key: 'Synonyms', value: 'synonyms' },
    { key: 'Stop Words', value: 'stop_words' },
    { key: 'Bot Actions', value: 'bot_actions' },
    { key: 'Small Talk', value: 'small_talk' },
    { key: 'Custom Configurations', value: 'custom_configurations' }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
