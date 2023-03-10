import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsService } from '@kore.apps/modules/apps/services/apps.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
// import { queryPipelineFeatureKey } from '@kore.apps/store/entity-metadata';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable, of, switchMap, withLatestFrom } from 'rxjs';
import { IndexPipelineService } from './index-pipeline.service';

@Injectable()
export class QueryPipelineDataService extends DefaultDataService<any> {
  // API_URL = 'https://jsonplaceholder.typicode.com/users';

  constructor(
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    private service: ServiceInvokerService,
    private appsService: AppsService,
    private indexPipelineService: IndexPipelineService
  ) {
    super('queryPipelineFeatureKey', http, httpUrlGenerator);
  }

  override getAll(): Observable<any[]> {
    const tik = this.appsService.getSearchIndexId().pipe(
      withLatestFrom(this.indexPipelineService.getIndexPipelineId()),
      switchMap(([searchIndexId, indexPipelineId]) => {
        return this.service.invoke('get.queryPipelines', {
          searchIndexId,
          indexPipelineId,
        });
      })
    );

    tik.subscribe((res) => console.log('PAPA', res));
    return tik;
  }
}
