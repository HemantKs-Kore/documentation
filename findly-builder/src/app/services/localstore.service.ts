import { Injectable } from '@angular/core';
import { environment } from '@kore.environment';

@Injectable({
  providedIn: 'root'
})
export class LocalStoreService {
  private storageType = 'localStorage';
  constructor() {
    if (environment && environment.USE_SESSION_STORE) {
      this.storageType = 'sessionStorage';
    }
  }

  /*
  returns
      false if user data not found in browser localstore,
      else returns accountDetails
  */
  public getAuthInfo(): any {
    try {
      let _accountDetails = window[this.storageType].getItem('jStorage');
      if (_accountDetails) {
        _accountDetails = JSON.parse(_accountDetails);
      } else {
        return false;
      }
      if (this.isEmpty(_accountDetails) && window.location.search.indexOf('currentBotId') !== -1) {
        window[this.storageType].setItem('currentBot', window.location.search.split('?currentBotId=')[1]);
      }

      return _accountDetails;
    } catch (error) {
      return false;
    }
  }

  public isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  public removeAuthInfo() {
    try {
      window[this.storageType].setItem('jStorage', '{}');
      window[this.storageType].setItem('krPreviousState', '{}');
      return true;
    } catch (error) {
      return false;
    }
  }

  public getSelectedAccount(): any {
    try {
      let _selectedAccount = window[this.storageType].getItem('selectedAccount');
      if (_selectedAccount) {
        _selectedAccount = JSON.parse(_selectedAccount);
      } else {
        return false;
      }
      return _selectedAccount;
    } catch (error) {
      return false;
    }
  }
  public getSelectedSSOAccount(): any {
    try {
      let _selectedSSOAccount = window[this.storageType].getItem('selectedSSOAccount');
      window[this.storageType].setItem('selectedAccount',_selectedSSOAccount);
      if (_selectedSSOAccount) {
        _selectedSSOAccount = JSON.parse(_selectedSSOAccount);
        window[this.storageType].removeItem('selectedSSOAccount');
      } else {
        return false;
      }
      return _selectedSSOAccount;
    } catch (error) {
      return false;
    }
  }
  public getAssociatedAccounts(): any[] {
    try {
      let _accountDetails = window[this.storageType].getItem('jStorage');
      if (_accountDetails) {
        _accountDetails = JSON.parse(_accountDetails);

        const currentAccount = _accountDetails.currentAccount;
        if (currentAccount && currentAccount.associatedAccounts && currentAccount.associatedAccounts.length) {
          return currentAccount.associatedAccounts;
        } else {
          return [];
        }
      } else {
        return [];
      }

    } catch (e) {
      return [];
    }
  }

}
