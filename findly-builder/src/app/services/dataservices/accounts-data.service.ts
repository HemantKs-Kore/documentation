import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AccountsDataService {
  private accountsData: object = {};

  constructor() {
  }

  public setAccountsData(data: object): any {
    this.accountsData = data;
  }

  public getAccountsData(): any {
    return this.accountsData || {};
  }
  public init() {
  }

}
