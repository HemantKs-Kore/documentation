import { createAction, props } from '@ngrx/store';
import { AppActionTypes } from './app.action-types';

export const setAppId = createAction(
  AppActionTypes.SET_APP_ID,
  props<{ appId: string; searchIndexId: string }>()
);

export const setIndexPipelineId = createAction(
  AppActionTypes.SET_INDEX_PIPELINE_ID,
  props<{ indexPipelineId: string }>()
);

export const setQueryPipelineId = createAction(
  AppActionTypes.SET_QUERY_PIPELINE_ID,
  props<{ queryPipelineId: string }>()
);
