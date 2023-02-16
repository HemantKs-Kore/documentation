import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { appsFeatureKey } from '@kore.apps/store/entity-metadata';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';

@Injectable()
export class AppsDataService extends DefaultDataService<any> {
  // API_URL = 'https://jsonplaceholder.typicode.com/users';

  constructor(
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    private service: ServiceInvokerService
  ) {
    super(appsFeatureKey, http, httpUrlGenerator);
  }

  override getAll(): Observable<any[]> {
    return this.service.invoke('get.apps');
  }

  override add(payload): Observable<any> {
    return this.service.invoke('create.app', {}, payload);
  }

  // update(user): Observable<UserInterface> {
  //   return this.http.put<UserInterface>(
  //     `${this.API_URL}/${user.id}`,
  //     user.changes,
  //   );
  // }

  override delete(appId): Observable<any> {
    return this.service.invoke('delete.app', { streamId: appId });
  }
}
