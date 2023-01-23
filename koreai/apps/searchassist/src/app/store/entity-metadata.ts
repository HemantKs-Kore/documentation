import { EntityMetadataMap, EntityDataModuleConfig } from '@ngrx/data';

export const appsFeatureKey = 'apps';
export const indexPipelineFeatureKey = 'indexPipeline';
export const queryPipelineFeatureKey = 'queryPipeline';

export const entityMetadata: EntityMetadataMap = {
  [appsFeatureKey]: {
    entityDispatcherOptions: {
      optimisticUpdate: true,
    },
    selectId: (data) => data._id,
    // sortComparer: sort
  },
  [indexPipelineFeatureKey]: {
    entityDispatcherOptions: {
      optimisticUpdate: true,
    },
    selectId: (data) => data._id,
  },
  [queryPipelineFeatureKey]: {
    entityDispatcherOptions: {
      optimisticUpdate: true,
    },
    selectId: (data) => data._id,
  },
};

const pluralNames = {};

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames,
};
