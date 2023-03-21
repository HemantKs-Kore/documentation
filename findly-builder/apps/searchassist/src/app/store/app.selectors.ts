import { createSelector } from '@ngrx/store';
import { AppState } from './reducers';

export const selectAppFeature = (state) => state.app;
export const selectAppId = createSelector(
  selectAppFeature,
  (state: AppState) => state.appId
);
export const selectSearchIndexId = createSelector(
  selectAppFeature,
  (state: AppState) => state.searchIndexId
);
export const selectIndexPipelineId = createSelector(
  selectAppFeature,
  (state: AppState) => state.indexPipelineId
);
export const selectIndexPipelines = createSelector(
  selectAppFeature,
  (state: AppState) => state.indexPipelines
);

export const selectIndexConfig = createSelector(
  selectIndexPipelines,
  selectIndexPipelineId,
  (pipelines, indexPipelineId) => {
    return pipelines.find((item) => item._id === indexPipelineId);
  }
);

export const selectQueryPipelineId = createSelector(
  selectAppFeature,
  (state: AppState) => state.queryPipelineId
);

export const selectQueryPipelines = createSelector(
  selectAppFeature,
  (state: AppState) => state.queryPipelines
);

export const selectAppIds = createSelector(
  selectAppId,
  selectSearchIndexId,
  selectIndexPipelineId,
  selectQueryPipelineId,
  (streamId, searchIndexId, indexPipelineId, queryPipelineId) => {
    return { streamId, searchIndexId, indexPipelineId, queryPipelineId };
  }
);

export const selectSearchExperiance = createSelector(
  selectAppFeature,
  (state: AppState) => state.searchExperienceConfig
);

export const selectEnablePreview = createSelector(
  selectAppFeature,
  (state: AppState) => !state.searchExperienceConfig
);
