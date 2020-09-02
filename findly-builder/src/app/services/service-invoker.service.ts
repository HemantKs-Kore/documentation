import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPointsService } from '@kore.services/end-points.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceInvokerService {
  private DEFAULT_HEADERS = {
    'Content-Type': 'application/json;charset=UTF-8'
  };
  private UPLOAD_HEADERS = {
      'Content-Type': undefined // 'multipart/form-data' //
  };
  public invoke(serviceId?:string, qParams?:any, payload?:any, headers?:any): Observable<any> {
    const conf = this.prepareHttpCall(serviceId, qParams, payload, headers);
    const _args=[conf.url];

    if(conf.method==='get'||conf.method==='delete'){
      _args.push({
        headers: conf.headers,
        params:conf.payload
      });
    }else{
      _args.push(conf.payload,{
          headers: conf.headers
        });
      }
    return this.http[conf.method].apply(this.http,_args);
  }
  private prepareHttpCall(serviceId, qParams, payload, headers) {
    const HTTP_VERB_GET = 'get';
        const HTTP_VERB_POST = 'post';
        const HTTP_VERB_PUT = 'put';
        const HTTP_VERB_DELETE = 'delete';

        const serviceConf = this.endpoints.getServiceInfo(serviceId);
        let _url;
        let _verb;
        let _headers = JSON.parse(JSON.stringify(this.DEFAULT_HEADERS));
        if(headers){
          _headers = JSON.parse(JSON.stringify(headers));
        }else if (serviceId === 'post.fileupload') {
          _headers = JSON.parse(JSON.stringify(this.UPLOAD_HEADERS));
      }
    try {
      _verb = serviceConf.method;
      _url = serviceConf.endpoint;
      _url = this.resolveUrl(_url, qParams||{}, false);
    } catch (error) {
      throw new Error('Unable to find Endpoint or method');
    }

    _url += _url.indexOf('?') > -1 ? '&' : '?';
    _url += this.genRandQuery();

    if (_verb === HTTP_VERB_DELETE) {
      _verb = HTTP_VERB_POST;
      _headers['X-HTTP-Method-Override'] = HTTP_VERB_DELETE;
    }
    if (_verb === HTTP_VERB_PUT) {
      _verb = HTTP_VERB_POST;
      _headers['X-HTTP-Method-Override'] = HTTP_VERB_PUT;
    }
    return {
      method: _verb,
      url: _url,
      headers: Object.assign(headers||{},_headers), // Optional headers
      payload: payload || {}
      // cache: true
    };
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

  private genRandQuery() {
    return 'rnd=' + Math.random().toString(36).substr(7);
  }
  constructor(
    private endpoints: EndPointsService,
    private http: HttpClient
  ) {}
}
