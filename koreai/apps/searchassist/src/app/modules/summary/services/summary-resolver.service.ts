import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { IndexPipelineService } from './index-pipeline.service';
import { QueryPipelineService } from './query-pipeline.service';

@Injectable({
  providedIn: 'root',
})
export class IndexPipelineDataResolver implements Resolve<boolean> {
  constructor(
    private indexPipelineService: IndexPipelineService,
    private queryPipelineService: QueryPipelineService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.indexPipelineService.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.indexPipelineService.getAll();
          this.queryPipelineService.getAll();
        }
      }),
      first()
    );
  }
}

// @Injectable({
//   providedIn: 'root',
// })
// export class QueryPipelineDataResolver implements Resolve<boolean> {
//   constructor(private queryPipelineService: QueryPipelineService) {}
//   resolve(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean> {
//     return this.queryPipelineService.loaded$.pipe(
//       tap((loaded) => {
//         if (!loaded) {
//           this.queryPipelineService.getAll();
//         }
//       }),
//       first()
//     );
//   }
// }
