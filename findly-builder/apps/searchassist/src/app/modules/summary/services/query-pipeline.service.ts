import { Injectable } from '@angular/core';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
// import { queryPipelineFeatureKey } from '@kore.apps/store/entity-metadata';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QueryPipelineService extends EntityCollectionServiceBase<any> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    private service: ServiceInvokerService
  ) {
    super('queryPipelineFeatureKey', serviceElementsFactory);
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

  getQueryPipelineId() {
    return this.getItemById().pipe(
      map((item) => {
        return item?._id;
      })
    );
  }

  getQueryPipelines({ searchIndexId, _id }) {
    return this.service
      .invoke('get.queryPipelines', {
        searchIndexId: searchIndexId,
        indexPipelineId: _id,
      })
      .pipe(
        tap((res) => {
          this.addManyToCache(res);
        })
      );
  }

  // Add All your business logic here
}
