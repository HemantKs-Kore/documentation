import { Injectable } from '@angular/core';
import { environment } from '@kore.environment';
@Injectable({
  providedIn: 'root'
})
export class EndPointsService {

  private API_URL_PREFIX = '/api';
  private API_VERSION_PREFIX = '/1.1';
  private SERVER_URL: string;
  private API_SERVER_URL: string;

  private serviceList: object = {};

  constructor() {
    if (environment.production) {
      this.SERVER_URL = window.location.protocol + '//' + window.location.host;
      this.API_SERVER_URL = this.SERVER_URL + this.API_URL_PREFIX + this.API_VERSION_PREFIX;
    } else {
      this.API_SERVER_URL = environment.API_SERVER_URL + this.API_URL_PREFIX + this.API_VERSION_PREFIX;
    }
    this.init();
  }

  public getServiceInfo(serviceId): any {
    return this.serviceList[serviceId] || {};
  }
  public init() {
    this.serviceList['sales.signout'] = {
      endpoint: this.API_SERVER_URL + '/oAuth/signout',
      method: 'delete'
    };

    this.serviceList['app.controls'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/AppControlList',
      method: 'get'
    };

    this.serviceList['get.deflect.apps'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps',
      method: 'get'
    };
    this.serviceList['create.app'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/streams',
      method: 'post'
    };
    this.serviceList['get.apps'] = {
      endpoint: this.API_SERVER_URL + '/findly/apps',
      method: 'get'
    };
    this.serviceList['add.source'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/source',
      method: 'post'
    };
    this.serviceList['get.source.list'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/:type/source?limit=:limit&skip=:skip',
      method: 'get'
    };
    this.serviceList['get.extracted.pags'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/content/source/webdomain/:webDomainId/pages?limit=:limit&skip=:skip',
      method: 'get'
    };
    this.serviceList['delete.contnet.page']={
      endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/content/source/webdomain/:webDomainId/pages/:pageId',
      method:'delete'
    };
    this.serviceList['get.job.status'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/:type/source/status',
      method: 'get'
    };
    this.serviceList['deflect.seed.data'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/seed_data',
      method: 'get'
    };
    this.serviceList['get.token'] = {
      endpoint: this.API_SERVER_URL + '/sso/token',
      method: 'get'
    };
    this.serviceList['post.fileupload']={
      endpoint:this.API_SERVER_URL + '/users/:userId/file',
      method:'post'
    };
    this.serviceList['add.sourceMaterial']={
      endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/:type/source?sourceType=:faqType',
      method:'post'
    };
  }
}
