import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,HttpResponse
} from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError,tap} from 'rxjs/operators';
import {AuthService} from "@kore.services/auth.service";
import {AppUrlsService} from "@kore.services/app.urls.service"
import { LocalStoreService } from '@kore.services/localstore.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private auth: AuthService,private appUrls:AppUrlsService, private localStoreService: LocalStoreService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    let authToken = this.auth.getAccessToken();
    if(!authToken){
      this.redirectToLogin();
    }

    let _bearer="bearer "+authToken;
    let _reqAdditions:any = {
      setHeaders: {
        Authorization: _bearer
      } //setting Authorization bearer
      , url: this.resolveUrl(req.url, { userId: this.auth.getUserId() }, false)//setting userid if URL has empty userId 
    };

    //setting AccountId header
    let selectedAccount = this.localStoreService.getSelectedAccount() || this.auth.getSelectedAccount();
    if (selectedAccount) {
      _reqAdditions.setHeaders.AccountId = selectedAccount.accountId;
    }


    let authReq = req.clone(_reqAdditions);

    // send cloned request with header to the next handler.
    return next.handle(authReq).pipe(
      tap(event => {
       
      }, error => {
        if(error.status===401){
          //window.alert('Session Expired');
         this.redirectToLogin();
        }
      })
    )
  }

  private redirectToLogin(){
    this.appUrls.redirectToLogin();
  }
  private resolveUrl(toResolveUrl, values, deleteProp) {
    let _regExToParamName = /\:([a-zA-Z]+)/g;
    return toResolveUrl.replace(_regExToParamName, function (matchStr, valName) {
      var r = values[valName];
      if (typeof r !== 'undefined' && typeof r !== null) {
        if (deleteProp) {
          delete values[valName];
        }
        // encodeURIComponent is applied because $http removes special characters like '#' from the query
        //return encodeURIComponent(r);
        return r;
      }
      return matchStr;
    });
  }
}
