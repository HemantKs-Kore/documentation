import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import {
  selectAppId,
  selectIndexPipelineId,
  selectQueryPipelineId,
  selectSearchIndexId,
} from './app.selectors';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  ids$ = this.store.select(selectQueryPipelineId).pipe(
    withLatestFrom(
      this.store.select(selectAppId),
      this.store.select(selectSearchIndexId),
      this.store.select(selectIndexPipelineId)
    ),
    map(([queryPipelineId, streamId, searchIndexId, indexPipelineId]) => {
      return {
        streamId,
        searchIndexId,
        indexPipelineId,
        queryPipelineId,
      };
    })
  );

  constructor(private store: Store) {}
}
