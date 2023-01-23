import { Injectable } from '@angular/core';
import { appsFeatureKey } from '@kore.apps/store/entity-metadata';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppsService extends EntityCollectionServiceBase<any> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super(appsFeatureKey, serviceElementsFactory);
  }

  getSelectedAppById(appId?) {
    return this.entities$.pipe(
      map((apps) => {
        if (appId) {
          return apps.find((app) => {
            return app.id === appId;
          });
        }
        return apps[0];
      })
    );
  }

  getSearchIndexId() {
    return this.getSelectedAppById().pipe(
      map((app) => {
        return app?.searchIndexes[0]._id;
      })
    );
  }

  // Add All your business logic here
}
