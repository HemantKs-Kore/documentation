import { catchError, switchMap } from 'rxjs/operators';
import { ServiceInvokerService } from '../service-invoker.service';
import { WorkflowService } from '../workflow.service';
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
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private store: Store
  ) {}

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
  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private store: Store
  ) {}

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

// import { catchError, filter, switchMap, tap } from 'rxjs/operators';
// import { ServiceInvokerService } from '../service-invoker.service';
// import { WorkflowService } from '../workflow.service';
// import { Injectable } from '@angular/core';
// import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
// import { combineLatest, forkJoin, Observable, of } from 'rxjs';
// import { delay } from 'rxjs/operators';
// // import { IndexPipelineService } from '@kore.apps/modules/summary/services/index-pipeline.service';
// import { QueryPipelineService } from '@kore.apps/modules/summary/services/query-pipeline.service';
// import { AppsService } from '@kore.apps/modules/apps/services/apps.service';

// @Injectable()
// export class PipelineDataResolver implements Resolve<any> {
//   appId$ = this.appsService.getSelectedAppId();
//   indexPipelineId$ = this.indexPipelineService.getIndexPipelineId();
//   queryPipelineId$ = this.queryPipelineService.getQueryPipelineId();

//   constructor(
//     public workflowService: WorkflowService,
//     private service: ServiceInvokerService,
//     private appsService: AppsService,
//     private indexPipelineService: IndexPipelineService,
//     private queryPipelineService: QueryPipelineService
//   ) {}

//   resolve(route: ActivatedRouteSnapshot) {
//     const value = route.data['value'];

//     return combineLatest([
//       this.appId$,
//       this.indexPipelineId$,
//       this.queryPipelineId$,
//     ]).pipe(
//       // filter((res) => !!(res[0] && res[1] && res[2])),
//       tap((res) => {
//         console.log('SGGSGGS', res);
//       }),
//       switchMap(([appId, indexPipelineId, queryPipelineId]) => {
//         const quaryparms: any = {
//           isSelected: true,
//           sortField: 'fieldName',
//           orderType: 'asc',
//           indexPipelineId,
//           streamId: appId,
//           queryPipelineId,
//           searchKey: '',
//         };

//         if (indexPipelineId && queryPipelineId) {
//           return this.service.invoke(value, quaryparms).pipe(
//             catchError((error) => {
//               const message = `Retrieval error: ${error}`;
//               console.error(message);
//               return of({ error });
//             })
//           );
//         }

//         return of(null);
//       })
//     );
//   }
// }

// @Injectable()
// export class PipelineResolver implements Resolve<any> {
//   constructor(
//     public workflowService: WorkflowService,
//     private service: ServiceInvokerService
//   ) {}

//   resolve(route: ActivatedRouteSnapshot) {
//     let value = route.data['pipeline'];
//     const quaryparms: any = {
//       indexPipelineId: this.workflowService.selectedIndexPipeline(),
//       queryPipelineId: this.workflowService.selectedQueryPipeline()
//         ? this.workflowService.selectedQueryPipeline()._id
//         : '',
//       searchIndexID: this.workflowService.selectedApp()?.searchIndexes[0]?._id,
//     };

//     if (quaryparms.queryPipelineId) {
//       return this.service.invoke(value, quaryparms).pipe(delay(10));
//     } else {
//       return of(null);
//     }
//   }
// }
