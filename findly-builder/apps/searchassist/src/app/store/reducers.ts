import { SearchExperienceConfigInterface } from '@kore.apps/shared/types/search-experience-config';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { createReducer, on } from '@ngrx/store';

import {
  addIndexPipeline,
  removeIndexPipeline,
  setAppId,
  setIndexPipelineId,
  setIndexPipelines,
  setQueryPipelineId,
  setQueryPipelines,
  setSearchExperienceConfigSuccess,
  updateIndexPipeline,
} from './app.actions';

export interface AppState {
  router?: RouterReducerState;
  appId: string;
  searchIndexId: string;
  indexPipelineId: string;
  indexPipelines: any[];
  queryPipelineId: string;
  searchExperienceConfig: SearchExperienceConfigInterface;
  queryPipelines: any[];
}

const appInitialState: AppState = {
  appId: null,
  searchIndexId: null,
  indexPipelineId: null,
  indexPipelines: [],
  queryPipelineId: null,
  searchExperienceConfig: null,
  queryPipelines: [],
};

export const rootReducer = createReducer(
  appInitialState,
  on(setAppId, (state, { appId, searchIndexId }) => {
    return { ...state, appId, searchIndexId, searchExperienceConfig: null };
  }),
  on(setIndexPipelineId, (state, { indexPipelineId }) => {
    return { ...state, indexPipelineId };
  }),
  on(setIndexPipelines, (state, { indexPipelines }) => {
    return { ...state, indexPipelines };
  }),
  on(addIndexPipeline, (state, { indexPipeline }) => {
    return {
      ...state,
      indexPipelines: [indexPipeline, ...state.indexPipelines],
    };
  }),
  on(updateIndexPipeline, (state, { indexPipeline, isDefault }) => {
    return {
      ...state,
      indexPipelines: state.indexPipelines.map((item) => {
        if (item._id === indexPipeline._id) {
          return indexPipeline;
        }

        if (isDefault) {
          return {
            ...item,
            default: false,
          };
        }

        return item;
      }),
    };
  }),
  on(removeIndexPipeline, (state, { indexPipelineId }) => {
    return {
      ...state,
      indexPipelines: state.indexPipelines.filter(
        (item) => item._id !== indexPipelineId
      ),
    };
  }),
  on(setQueryPipelineId, (state, { queryPipelineId }) => {
    return { ...state, queryPipelineId };
  }),
  on(setSearchExperienceConfigSuccess, (state, { searchExperienceConfig }) => {
    return { ...state, searchExperienceConfig };
  }),
  on(setQueryPipelines, (state, { queryPipelines }) => {
    return { ...state, queryPipelines };
  })
);

export const appReducers = {
  router: routerReducer,
  app: rootReducer,
};
