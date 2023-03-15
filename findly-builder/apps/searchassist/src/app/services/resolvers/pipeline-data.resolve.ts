import { catchError, switchMap } from 'rxjs/operators';
import { ServiceInvokerService } from '../service-invoker.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import {
  selectAppId,
  selectIndexPipelineId,
  selectQueryPipelineId,
  selectSearchIndexId,
} from '@kore.apps/store/app.selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class PipelineDataResolver implements Resolve<any> {
  constructor(private service: ServiceInvokerService, private store: Store) {}

  resolve(route: ActivatedRouteSnapshot) {
    const value = route.data['value'];

    return combineLatest([
      this.store.select(selectIndexPipelineId),
      this.store.select(selectQueryPipelineId),
      this.store.select(selectAppId),
    ]).pipe(
      switchMap(([indexPipelineId, queryPipelineId, appId]) => {
        const quaryparms: any = {
          isSelected: true,
          sortField: 'fieldName',
          orderType: 'asc',
          indexPipelineId,
          streamId: appId,
          queryPipelineId,
          searchKey: '',
        };

        return this.service.invoke(value, quaryparms).pipe(
          catchError((error) => {
            const message = `Retrieval error: ${error}`;
            console.error(message);
            return of({ error });
          })
        );
      })
    );
  }
}

@Injectable()
export class PipelineResolver implements Resolve<any> {
  constructor(private service: ServiceInvokerService, private store: Store) {}

  resolve(route: ActivatedRouteSnapshot) {
    const value = route.data['pipeline'];

    return combineLatest([
      this.store.select(selectIndexPipelineId),
      this.store.select(selectQueryPipelineId),
      this.store.select(selectSearchIndexId),
    ]).pipe(
      switchMap(([indexPipelineId, queryPipelineId, searchIndexID]) => {
        return this.service
          .invoke(value, { indexPipelineId, queryPipelineId, searchIndexID })
          .pipe(
            catchError((error) => {
              const message = `Retrieval error: ${error}`;
              console.error(message);
              return of({ error });
            })
          );
      })
    );
  }
}
