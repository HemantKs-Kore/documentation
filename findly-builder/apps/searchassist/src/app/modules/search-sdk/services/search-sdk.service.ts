import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, skip } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchSdkService {
  private subject = new BehaviorSubject<boolean>(true);
  sdkSource$ = this.subject
    .asObservable()
    .pipe(distinctUntilChanged(), skip(1));

  constructor() {}

  toggleSdkPopup() {
    this.subject.next(!this.subject.value);
  }
}
