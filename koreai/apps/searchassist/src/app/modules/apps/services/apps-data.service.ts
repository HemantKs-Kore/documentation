import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceInvokerService } from '@kore.apps/services/service-invoker.service';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { appsFeatureKey } from '../apps.module';

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
