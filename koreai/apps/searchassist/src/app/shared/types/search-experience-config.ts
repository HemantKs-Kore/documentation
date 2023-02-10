export interface ExperienceConfig {
  searchBarPosition: string;
}

export interface WidgetConfig {
  searchBarFillColor: string;
  searchBarBorderColor: string;
  searchBarPlaceholderText: string;
  searchBarPlaceholderTextColor: string;
  searchButtonEnabled: boolean;
  buttonText: string;
  buttonTextColor: string;
  buttonFillColor: string;
  buttonBorderColor: string;
  userSelectedColors: string[];
  buttonPlacementPosition: string;
  searchBarIcon: string;
}

export interface FeedbackExperience {
  queryLevel: boolean;
  lmod: Date;
  smartAnswer: boolean;
}

export interface InteractionsConfig {
  welcomeMsg: string;
  welcomeMsgColor: string;
  showSearchesEnabled: boolean;
  showSearches: string;
  autocompleteOpt: boolean;
  querySuggestionsLimit: number;
  liveSearchResultsLimit: number;
  feedbackExperience: FeedbackExperience;
}

export interface Config {
  botActionTemplate: string;
  botActionResultsExperience: string;
}

export interface SearchExperienceConfigInterface {
  _id: string;
  experienceConfig: ExperienceConfig;
  widgetConfig: WidgetConfig;
  interactionsConfig: InteractionsConfig;
  streamId: string;
  searchIndexId: string;
  indexPipelineId: string;
  createdBy: string;
  lModifiedBy: string;
  createdOn: Date;
  lModifiedOn: Date;
  __v: number;
  queryPipelineId: string;
  config: Config;
}
