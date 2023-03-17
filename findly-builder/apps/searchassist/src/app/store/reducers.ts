import { SearchExperienceConfigInterface } from '@kore.apps/shared/types/search-experience-config';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { createReducer, on } from '@ngrx/store';

import {
  addIndexPipeline,
  addQueryPipeline,
  removeIndexPipeline,
  removeQueryPipeline,
  resetAppIds,
  resetIndexPipelineId,
  setAppId,
  setIndexPipelineId,
  setIndexPipelines,
  setQueryPipelineId,
  setQueryPipelines,
  setSearchExperienceConfigSuccess,
  updateIndexPipeline,
  updateQueryPipeline,
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
  on(resetAppIds, (state, { appId }) => {
    if (appId === state.appId) {
      return {
        ...state,
        appId: null,
        searchIndexId: null,
        indexPipelineId: null,
        queryPipelineId: null,
      };
    }

    return state;
  }),
  on(resetIndexPipelineId, (state, { appId }) => {
    if (appId !== state.appId) {
      return {
        ...state,
        indexPipelineId: null,
      };
    }

    return state;
  }),
  on(setAppId, (state, { appId, searchIndexId }) => {
    return {
      ...state,
      appId,
      searchIndexId,
      ...(appId !== state.appId && { indexPipelineId: null }),
      searchExperienceConfig: null,
    };
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
  }),
  on(addQueryPipeline, (state, { queryPipeline }) => {
    return {
      ...state,
      queryPipelines: [queryPipeline, ...state.queryPipelines],
    };
  }),
  on(updateQueryPipeline, (state, { queryPipeline, isDefault }) => {
    return {
      ...state,
      queryPipelines: state.queryPipelines.map((item) => {
        if (item._id === queryPipeline._id) {
          return queryPipeline;
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
  on(removeQueryPipeline, (state, { queryPipelineId }) => {
    return {
      ...state,
      queryPipelines: state.queryPipelines.filter(
        (item) => item._id !== queryPipelineId
      ),
    };
  })
);

export const appReducers = {
  router: routerReducer,
  app: rootReducer,
};
