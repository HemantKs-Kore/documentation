import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,HttpResponse
} from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError,tap, retry} from 'rxjs/operators';
import {AuthService} from '@kore.services/auth.service';
import {AppUrlsService} from '@kore.services/app.urls.service'
import { LocalStoreService } from '@kore.services/localstore.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService,private appUrls:AppUrlsService, private localStoreService: LocalStoreService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = this.auth.getAccessToken();
    if(!authToken){
      this.redirectToLogin();
    }

    const _bearer='bearer '+authToken;
    const _reqAdditions:any = {
      setHeaders: {
        Authorization: _bearer
      } // setting Authorization bearer
      , url: this.resolveUrl(req.url, { userId: this.auth.getUserId() }, false)// setting userid if URL has empty userId
    };

    // setting AccountId header
    const selectedAccount = this.localStoreService.getSelectedAccount() || this.auth.getSelectedAccount();
    let skipAccountHeaders = false;
    if(req && req.url && req.url.includes('/AppControlList')){
      skipAccountHeaders = true
    }
    if (selectedAccount && !skipAccountHeaders) {
      _reqAdditions.setHeaders.AccountId = selectedAccount.accountId;
    }


    const authReq = req.clone(_reqAdditions);

    // send cloned request with header to the next handler.
    return next.handle(authReq).pipe(
      tap(event => {

      }, error => {
        if(error.status===401){
          // window.alert('Session Expired');
         this.redirectToLogin();
        }
      })
    )
  }

  private redirectToLogin(){
    this.appUrls.redirectToLogin();
  }
  private resolveUrl(toResolveUrl, values, deleteProp) {
    const _regExToParamName = /\:([a-zA-Z]+)/g;
    return toResolveUrl.replace(_regExToParamName, (matchStr, valName) => {
      const r = values[valName];
      if (typeof r !== 'undefined' && typeof r !== null) {
        if (deleteProp) {
          delete values[valName];
        }
        // encodeURIComponent is applied because $http removes special characters like '#' from the query
        // return encodeURIComponent(r);
        return r;
      }
      return matchStr;
    });
  }
}

