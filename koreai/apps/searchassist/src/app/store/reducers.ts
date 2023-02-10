import { SearchExperienceConfigInterface } from '@kore.apps/shared/types/search-experience-config';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { createReducer, on } from '@ngrx/store';

import {
  setAppId,
  setIndexPipelineId,
  setQueryPipelineId,
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
    return { ...state, appId, searchIndexId };
  }),
  on(setIndexPipelineId, (state, { indexPipelineId }) => {
    return { ...state, indexPipelineId };
  }),
  on(setQueryPipelineId, (state, { queryPipelineId }) => {
    return { ...state, queryPipelineId };
  })
);

export const appReducers = {
  router: routerReducer,
  app: rootReducer,
};
