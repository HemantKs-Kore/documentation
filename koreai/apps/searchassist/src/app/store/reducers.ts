import { SearchExperienceConfigInterface } from '@kore.apps/shared/types/search-experience-config';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { createReducer, on } from '@ngrx/store';

import {
  setAppId,
  setIndexPipelineId,
  setQueryPipelineId,
  setSearchExperienceConfigSuccess,
} from './app.actions';

export interface AppState {
  router?: RouterReducerState;
  appId: string;
  searchIndexId: string;
  indexPipelineId: string;
  queryPipelineId: string;
  searchExperienceConfig: SearchExperienceConfigInterface;
}

const appInitialState: AppState = {
  appId: null,
  searchIndexId: null,
  indexPipelineId: null,
  queryPipelineId: null,
  searchExperienceConfig: null,
};

export const rootReducer = createReducer(
  appInitialState,
  on(setAppId, (state, { appId, searchIndexId }) => {
    return { ...state, appId, searchIndexId, searchExperienceConfig: null };
  }),
  on(setIndexPipelineId, (state, { indexPipelineId }) => {
    return { ...state, indexPipelineId };
  }),
  on(setQueryPipelineId, (state, { queryPipelineId }) => {
    return { ...state, queryPipelineId };
  }),
  on(setSearchExperienceConfigSuccess, (state, { searchExperienceConfig }) => {
    return { ...state, searchExperienceConfig };
  })
);

export const appReducers = {
  router: routerReducer,
  app: rootReducer,
};
