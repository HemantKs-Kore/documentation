import { Injectable } from '@angular/core';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { SearchExperienceConfigInterface } from '@kore.apps/shared/types/search-experience-config';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, map, switchMap, tap, withLatestFrom } from 'rxjs';
import {
  setAppId,
  setIndexPipelineId,
  setIndexPipelines,
  setQueryPipelineId,
  setSearchExperienceConfigSuccess,
} from './app.actions';
import { selectAppIds, selectSearchIndexId } from './app.selectors';

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
            tap((indexPipelines: any[]) =>
              this.store.dispatch(setIndexPipelines({ indexPipelines }))
            ),
            map((indexPipelines: any[]) => {
              const defaultPipeline = indexPipelines.find(
                (item) => item.default
              );
              return setIndexPipelineId({
                indexPipelineId: defaultPipeline?._id,
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

  searchExperienceConfig$ = createEffect((): any => {
    return this.actions$.pipe(
      ofType(setQueryPipelineId),
      withLatestFrom(this.store.select(selectAppIds)),
      switchMap((res) => {
        const { searchIndexId, indexPipelineId, queryPipelineId } = res[1];
        return this.service
          .invoke('get.searchexperience.list', {
            searchIndexId,
            indexPipelineId,
            queryPipelineId,
          })
          .pipe(
            map((searchExperienceConfig: SearchExperienceConfigInterface) => {
              return setSearchExperienceConfigSuccess({
                searchExperienceConfig,
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
