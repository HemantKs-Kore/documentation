import { SearchExperienceConfigInterface } from '@kore.apps/shared/types/search-experience-config';
import { createAction, props } from '@ngrx/store';
import { AppActionTypes } from './app.action-types';

export const setAppId = createAction(
  AppActionTypes.SET_APP_ID,
  props<{ appId: string; searchIndexId: string }>()
);

export const setIndexPipelines = createAction(
  AppActionTypes.SET_INDEX_PIPELINES,
  props<{ indexPipelines: any[] }>()
);

export const addIndexPipeline = createAction(
  AppActionTypes.ADD_INDEX_PIPELINE,
  props<{ indexPipeline: any }>()
);

export const updateIndexPipeline = createAction(
  AppActionTypes.UPDATE_INDEX_PIPELINE,
  props<{ indexPipeline: any; isDefault: boolean }>()
);

export const removeIndexPipeline = createAction(
  AppActionTypes.REMOVE_INDEX_PIPELINE,
  props<{ indexPipelineId: string }>()
);

export const setIndexPipelineId = createAction(
  AppActionTypes.SET_INDEX_PIPELINE_ID,
  props<{ indexPipelineId: string }>()
);

export const setQueryPipelineId = createAction(
  AppActionTypes.SET_QUERY_PIPELINE_ID,
  props<{ queryPipelineId: string }>()
);

export const setSearchExperienceConfig = createAction(
  AppActionTypes.SET_SEARCH_EXPERIENCE_CONFIG,
  props<{
    searchIndexId: string;
    indexPipelineId: string;
    queryPipelineId: string;
  }>()
);
export const setSearchExperienceConfigSuccess = createAction(
  AppActionTypes.SET_SEARCH_EXPERIENCE_CONFIG,
  props<{
    searchExperienceConfig: SearchExperienceConfigInterface;
  }>()
);

export const setQueryPipelines = createAction(
  AppActionTypes.SET_QUERY_PIPELINES,
  props<{ queryPipelines: any[] }>()
);
