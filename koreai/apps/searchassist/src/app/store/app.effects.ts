import { Injectable } from '@angular/core';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  EMPTY,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import {
  setAppId,
  setIndexPipelineId,
  setQueryPipelineId,
} from './app.actions';
import { selectSearchIndexId } from './app.selectors';

@Injectable()
export class AppEffects {
  // Set IDS
  setAppIds$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(setAppId),
      switchMap(({ searchIndexId }) => {
        return this.service
          .invoke('get.indexPipeline', {
            searchIndexId,
          })
          .pipe(
            map((indexPipelines: any[]) => {
              return setIndexPipelineId({
                indexPipelineId: indexPipelines[0]?._id,
              });
            }),
            catchError(() => EMPTY)
          );
      })
    );
  });

  setQueryPipelineId$ = createEffect((): any => {
    return this.actions$.pipe(
      ofType(setIndexPipelineId),
      withLatestFrom(this.store.select(selectSearchIndexId)),
      switchMap(([{ indexPipelineId }, searchIndexId]) => {
        return this.service
          .invoke('get.queryPipelines', {
            searchIndexId,
            indexPipelineId,
          })
          .pipe(
            map((queryPipelines: any[]) => {
              return setQueryPipelineId({
                queryPipelineId: queryPipelines[0]?._id,
              });
            }),
            catchError(() => EMPTY)
          );
      })
    );
  });

  constructor(
    private store: Store,
    private actions$: Actions,
    private service: ServiceInvokerService
  ) {}
}
