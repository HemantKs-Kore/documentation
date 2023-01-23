import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsService } from '@kore.apps/modules/apps/services/apps.service';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { indexPipelineFeatureKey } from '@kore.apps/store/entity-metadata';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable, switchMap } from 'rxjs';

@Injectable()
export class IndexPipelineDataService extends DefaultDataService<any> {
  // API_URL = 'https://jsonplaceholder.typicode.com/users';

  constructor(
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    private service: ServiceInvokerService,
    private appsService: AppsService
  ) {
    super(indexPipelineFeatureKey, http, httpUrlGenerator);
  }

  override getAll(): Observable<any[]> {
    const header: any = {
      'x-timezone-offset': '-330',
    };

    return this.appsService.getSearchIndexId().pipe(
      switchMap((searchIndexId) => {
        const quaryparms: any = {
          searchIndexId,
          offset: 0,
          limit: 100,
        };

        return this.service.invoke('get.indexPipeline', quaryparms, header);
      })
    );
  }

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
