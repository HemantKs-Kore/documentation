import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsService } from '@kore.apps/modules/apps/services/apps.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { queryPipelineFeatureKey } from '@kore.apps/store/entity-metadata';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable, of, switchMap, withLatestFrom } from 'rxjs';

@Injectable()
export class QueryPipelineDataService extends DefaultDataService<any> {
  // API_URL = 'https://jsonplaceholder.typicode.com/users';

  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super(queryPipelineFeatureKey, http, httpUrlGenerator);
  }

  override getAll(): Observable<any[]> {
    return of([]);
  }

  // override getAll(): Observable<any[]> {
  //   // const payload = {
  //   //   searchIndexId: this.workflowService.selectedSearchIndex(),
  //   //   indexPipelineId: this.workflowService.selectedIndexPipeline() || '',
  //   // };
  //   // const appObserver = this.service.invoke('get.queryPipelines', payload);

  //   const tik = this.appsService.getSearchIndexId().pipe(
  //     withLatestFrom(this.indexPipelineService.getIndexPipelineId()),
  //     switchMap(([searchIndexId, indexPipelineId]) => {
  //       return this.service.invoke('get.queryPipelines', {
  //         searchIndexId,
  //         indexPipelineId,
  //       });
  //     })
  //   );

  //   tik.subscribe((res) => console.log('PAPA', res));
  //   return tik;
  // }

  // add(user): Observable<UserInterface> {
  //   return this.http.post<UserInterface>(`${this.API_URL}`, user);
  // }

  // update(user): Observable<UserInterface> {
  //   return this.http.put<UserInterface>(
  //     `${this.API_URL}/${user.id}`,
  //     user.changes,
  //   );
  // }

  // delete(userId): Observable<any> {
  //   return this.http.delete(`${this.API_URL}/${userId}`);
  // }
}
