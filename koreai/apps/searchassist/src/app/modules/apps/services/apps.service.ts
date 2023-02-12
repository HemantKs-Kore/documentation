import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { map } from 'rxjs';
import { appsFeatureKey } from '../apps.module';

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
