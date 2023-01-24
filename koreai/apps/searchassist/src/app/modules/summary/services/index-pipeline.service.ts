import { Injectable } from '@angular/core';
// import { indexPipelineFeatureKey } from '@kore.apps/store/entity-metadata';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndexPipelineService extends EntityCollectionServiceBase<any> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('indexPipelineFeatureKey', serviceElementsFactory);
  }

  getItemById(dataId?) {
    return this.entities$.pipe(
      map((items) => {
        if (dataId) {
          return items.find((item: any) => {
            return item.id === dataId;
          });
        }
        return items[0];
      })
    );
  }

  getIndexPipelineId() {
    return this.getItemById().pipe(
      map((app) => {
        return app?._id;
      })
    );
  }

  // Add All your business logic here
}
