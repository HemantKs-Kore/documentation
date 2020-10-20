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

    this.serviceList['get.findly.apps'] = {
      endpoint: this.API_SERVER_URL + '/findlyai/apps',
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
    this.serviceList['get.source.list'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/:type/source?limit=:limit&skip=:skip',
      method: 'get'
    };
    this.serviceList['train.app'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/train',
      method: 'get'
    };
    this.serviceList['get.extracted.pags'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/content/source/webdomain/:webDomainId/pages?limit=:limit&skip=:skip',
      method: 'get'
    };
    this.serviceList['delete.content.page']={
      endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/content/source/webdomain/:webDomainId/pages/:pageId',
      method:'delete'
    };
    this.serviceList['delete.content.source']={
      endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/content/source/:webDomainId?type=:type',
      method:'delete'
    };
    this.serviceList['get.job.status'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/:type/source/status',
      method: 'get'
    };
    this.serviceList['get.job.statusById'] = {
      endpoint: this.API_SERVER_URL + '/findly/jobs/:jobId/status',
      method: 'get'
    };
    this.serviceList['findly.seed.data'] = {
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
      endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/:type/source',
      method:'post'
    };
    this.serviceList['add.sourceMaterialFaq']={
      endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/:type/source?sourceType=:faqType',
      method:'post'
    };
    this.serviceList['get.allFaqs']={
      endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/faq/list?skip=:offset&limit=:limit&source=all',
      method:'get'
    };
    this.serviceList['get.allFaqsByState']={
      endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/faq/list?skip=:offset&state=:state&limit=:limit&source=all',
      method:'get'
    };
    this.serviceList['get.faqs.search']={
      endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/faq/list?skip=:offset&state=:state&limit=:limit&source=all&search=:searchQuary',
      method:'get'
    };
    this.serviceList['get.allFaqsByResources']={
      endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/faq/list?skip=:offset&limit=:limit&state=:state&resourceId=:resourceId&serach=:searchQuary',
      method:'get'
    };
    this.serviceList['get.faqsByResourcesState']={
      endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/faq/list?skip=:offset&state=:state&limit=:limit&resourceId=:resourceId',
      method:'get'
    };
    this.serviceList['addRemove.faqs']={
      endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/faq/:faqId/stage?action=:method',
      method:'put'
    };
    this.serviceList['update.faq']={
      endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/faq/:faqId',
      method:'put'
    };
    this.serviceList['delete.faq']={
      endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/faq/:faqId',
      method:'delete'
    };
    this.serviceList['get.knowledgetasks'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/knowledgetasks?streamId=:streamId',
      method: 'get'
    };
    this.serviceList['create.knowledgetask'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/knowledgetasks',
      method: 'post'
    };
    this.serviceList['get.faqStatics'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/faq/stats',
      method: 'get'
    };
    this.serviceList['get.fags'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/faqs?ktId=:ktId',
      method: 'get'
    };

    this.serviceList['get.getorsearchfaq'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/faqs?ktId=:ktId&limit=:limit&offset=:offSet&search=:searchParam&parentId=:parentId&withallchild=:withallchild&type=:filter',
      method: 'get'
    };

    this.serviceList['create.faqs'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/faqs',
      method: 'post'
    };

    this.serviceList['edit.faq'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/faqs/:faqID',
      method: 'put'
    };
    this.serviceList['get.possibletags'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/faqs/possibletags?ktId=:ktId',
      method: 'post'
    };

    this.serviceList['get.globalsynonyms'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/streams/:streamId/builder/globalsynonyms?offset=:offset&limit=:limit&search=:search&keyword=:keyword&state=:state&ktId=:ktId',
      method: 'get'
    };

    this.serviceList['delete.faq.ind'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/faq/:faqId',
      method: 'delete'
    };
    this.serviceList['delete.faq.source'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/faq/source/:sourceId',
      method: 'delete'
    };
    this.serviceList['update.faq.bulk'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/faq/bulk',
      method: 'put'
    };
    this.serviceList['create.synonym'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/synonyms',
      method: 'post'
    };
    this.serviceList['get.synonym'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/synonyms?offset=:offset&limit=:limit',
      method: 'get'
    };
    this.serviceList['update.synonym'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/synonyms/:synonymId',
      method: 'put'
    };
    this.serviceList['delete.synonym'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/synonyms/:synonymId',
      method: 'delete'
    };
    this.serviceList['get.bots'] = {
      endpoint: this.API_SERVER_URL + '/builder/streams/:streamId/allTasks?allTasks=true?',
      method: 'get'
    };
    this.serviceList['get.traitgroup'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/streams/:streamId/traitgroup',
      method: 'get'
    };
    this.serviceList['post.traitgroup'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/streams/:streamId/traitgroup',
      method: 'post'
    };
    this.serviceList['get.autoTrainStatus'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/bt/streams/:streamId/autoTrainStatus?sentences=true&speech=false',
      method: 'get'
    };
    this.serviceList['create.group'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/groups',
      method: 'post'
    };
    this.serviceList['get.groups'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/groups?offset=0&limit=50',
      method: 'get'
    };
    this.serviceList['updateBulk.group'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/groups/:groupId',
      method: 'put'
    };
    this.serviceList['update.group'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/groups/:groupId',
      method: 'put'
    };
    this.serviceList['delete.group'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/groups/:groupId',
      method: 'delete'
    };
    this.serviceList['create.rule'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/rules',
      method: 'post'
    };
    this.serviceList['get.rules'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/rules?offset=0&limit=50',
      method: 'get'
    };
    this.serviceList['update.rule'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/rules/:ruleId',
      method: 'put'
    };
    this.serviceList['updateBulk.rule'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/rules/bulk',
      method: 'put'
    };
    this.serviceList['delete.rule'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/rules/:ruleId',
      method: 'delete'
    };
    this.serviceList['get.allGroups'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/groups?offset=:offset&limit=:limit',
      method: 'get'
    };
     /** Crwaler  */
    this.serviceList['create.crawler'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/content/source?',
      method: 'post'
    };
    this.serviceList['update.crawler'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/content/source/:sourceId',
      method: 'put'
    };
    /* Annotation tool */
    this.serviceList['attachment.file'] = {
      endpoint: this.API_SERVER_URL + '/attachment/file/:fileId/url',
      method: 'get'
    };
    this.serviceList['PdfAnno.get.userguide'] = {
      endpoint: this.API_SERVER_URL + '/builder/:streamId/getSavedAnnotatedDataForStream',
      method: 'get'
    };
    this.serviceList['PdfAnno.faq.annotate'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/faq/source?sourceType=:sourceType',
      method: 'post'
    };
    this.serviceList['PdfAnno.get.reAnnotateData'] = {
      endpoint: this.API_SERVER_URL + '/builder/:streamId/:fileId/getSavedAnnotatedData',
      method: 'get'
    };

    /* Service End-Points for Integrating APIs in bot-action Component */
    this.serviceList['get.AssociatedBots'] = {
      endpoint: this.API_SERVER_URL + '/users/:userID/builder/streams',
      method: 'get'
    };
    this.serviceList['get.AssociatedBotTasks'] = {
      endpoint: this.API_SERVER_URL + '/builder/streams/:botID/dialogs',
      method: 'get'
    }
    this.serviceList['put.LinkBot'] = {
      // endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/linkedbotdetails',
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/searchbot/linkbot',
      method: 'put'
    }
    this.serviceList['put.UnlinkBot'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/searchbot/unlink',
      method: 'put'
    }
  }
}
