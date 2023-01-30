import { createSelector } from '@ngrx/store';
import { AppState } from './reducers';

export const selectAppFeature = (state) => state.app;
export const selectSearchIndexId = createSelector(
  selectAppFeature,
  (state: AppState) => state.searchIndexId
);
// export const selectPipelineId = createSelector(
//   selectAppFeature,
//   (state: AppState) => state.indexPipelineId
// );
