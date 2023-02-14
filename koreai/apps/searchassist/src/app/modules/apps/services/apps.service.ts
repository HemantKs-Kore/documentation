import { Injectable } from '@angular/core';
import { selectAppId } from '@kore.apps/store/app.selectors';
import { appsFeatureKey } from '@kore.apps/store/entity-metadata';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { filter, map, withLatestFrom } from 'rxjs';

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

  getSelectedAppById() {
    return this.entities$.pipe(
      withLatestFrom(this.store.select(selectAppId)),
      map(([apps, selectedAppId]: any) => {
        if (selectedAppId) {
          return apps.find((app) => {
            return app._id === selectedAppId;
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
