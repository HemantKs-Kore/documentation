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
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/source?limit=:limit&skip=:skip',
      method: 'get'
    };
    this.serviceList['get.extracted.pags'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/source/webdomain/:webDomainId/pages?limit=:limit&skip=:skip',
      method: 'get'
    };
    this.serviceList['get.job.status'] = {
      endpoint: this.API_SERVER_URL + '/findly/jobs/:jobId/status',
      method: 'get'
    };
    this.serviceList['save.deflect.apps'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps',
      method: 'post'
    };

    this.serviceList['get.callflow.data'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/messages',
      method: 'get'
    };

    this.serviceList['save.callflow.data'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/messages',
      method: 'put'
    };

    this.serviceList['put.updateFormFields'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/formfields',
      method: 'put'
    };

    this.serviceList['get.getFormFields'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/formfields',
      method: 'get'
    };

    this.serviceList['get.summary'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/summary',
      method: 'get'
    };

    this.serviceList['post.publish'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/publish',
      method: 'post'
    };
    this.serviceList['get.ivrConfiguration.data'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/voicesettings',
      method: 'get'
    };

    this.serviceList['save.ivrConfiguration.data'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/voicesettings',
      method: 'put'
    };

    this.serviceList['deflect.seed.data'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/seed_data',
      method: 'get'
    };

    this.serviceList['enable.ivr.configuration'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/enableConfiguration',
      method: 'post'
    };

    this.serviceList['real.time.dashboardData'] = {
      endpoint: this.API_SERVER_URL + '/builder/metrics/usage/user/:userId/org/:orgId/stream/:streamId/rta/stats?metrics=inProgressSessions,automation,digitalFormInput,nAgentSessions',
      method: 'get'
    };

    this.serviceList['get.journey.flow'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/metrics/journeyFlow?startDate=:startDate&endDate=:endDate',
      method: 'get'
    };

    this.serviceList['get.configuration'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/configuration',
      method: 'get'
    };

    this.serviceList['post.configuration'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/configuration',
      method: 'post'
    };

    this.serviceList['get.agent.instructions'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/agents/:agentKey/instructions',
      method: 'get'
    };

    this.serviceList['get.sdk.apps'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:appId/sdk/apps',
      method: 'get'
    };

    this.serviceList['post.callLogs.data'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/callLogs',
      method: 'post'
    };

    this.serviceList['get.callLogs.data'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/callLogs',
      method: 'get'
    };

    this.serviceList['get.callflow.chatHistory'] = {
      endpoint: this.API_SERVER_URL + '/botmessages?botId=:streamId&msgId=:msgId&direction=0&limit=200',
      method: 'get'
    };
    this.serviceList['get.changeLogs'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/bt/:streamId/getbtlogs',
      method: 'get'
    };
    this.serviceList['get.token'] = {
      endpoint: this.API_SERVER_URL + '/sso/token',
      method: 'get'
    };
    this.serviceList['get.availableNumbers'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/availableNumbers',
      method: 'get'
    };
    this.serviceList['post.fileupload']={
      endpoint:this.API_SERVER_URL + '/users/:userId/file',
      method:'post'
    };

  }

}
