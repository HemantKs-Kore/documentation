import { Injectable } from '@angular/core';
import { appsFeatureKey } from '@kore.apps/store/entity-metadata';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppsService extends EntityCollectionServiceBase<any> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super(appsFeatureKey, serviceElementsFactory);
  }

  getApps() {
    return this.entities$.pipe(filter((res) => !!res.length));
  }

  getSelectedAppById(appId?) {
    return this.entities$.pipe(
      map((apps) => {
        if (appId) {
          return apps.find((app) => {
            return app._id === appId;
          });
        }
        return apps[0];
      })
    );
  }

  getSelectedAppId() {
    return this.getSelectedAppById().pipe(
      map((app) => {
        return app?._id;
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
