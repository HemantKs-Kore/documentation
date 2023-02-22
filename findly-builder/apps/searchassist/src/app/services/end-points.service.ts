import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class EndPointsService {
  private API_URL_PREFIX = '/searchassistapi';
  private API_VERSION_PREFIX = '/1.1';
  private SERVER_URL: string;
  private API_SERVER_URL: string;
  private API_URL_PREFIX_PLATFORM = '/api';
  private API_SERVER_URL_PLATFORM: string;
  private serviceList: object = {};

  constructor() {
    if (environment.production) {
      this.SERVER_URL = location.port
        ? environment.API_SERVER_URL
        : window.location.protocol + '//' + window.location.host;
      this.API_SERVER_URL = this.SERVER_URL + this.API_URL_PREFIX; //+ this.API_VERSION_PREFIX;
      this.API_SERVER_URL_PLATFORM = this.SERVER_URL + this.API_URL_PREFIX; //this.API_URL_PREFIX_PLATFORM + this.API_VERSION_PREFIX;
      window.appConfig.API_SERVER_URL = this.SERVER_URL;
    } else {
      this.API_SERVER_URL = environment.API_SERVER_URL + this.API_URL_PREFIX;
      this.API_SERVER_URL_PLATFORM =
        environment.API_SERVER_URL + this.API_URL_PREFIX; //this.API_URL_PREFIX_PLATFORM + this.API_VERSION_PREFIX;
      // Comment for  static URLS
      // this.API_SERVER_URL_PLATFORM = "https://50b6e8fd7c49.ngrok.io" + "/api/1.1"
      // this.API_SERVER_URL = "http://3cbe-2401-4900-1c0a-1381-4677-75fc-9139-453.ngrok.io" + "/searchassistapi"
      // this.API_SERVER_URL_PLATFORM = "http://3cbe-2401-4900-1c0a-1381-4677-75fc-9139-453.ngrok.io" + this.API_URL_PREFIX
    }
    this.init();
  }

  public getServiceInfo(serviceId): any {
    return this.serviceList[serviceId] || {};
  }
  public init() {
    this.serviceList['sales.signout'] = {
      endpoint: this.API_SERVER_URL_PLATFORM + '/oAuth/signout',
      method: 'delete',
    };

    this.serviceList['app.controls'] = {
      endpoint: this.API_SERVER_URL_PLATFORM + '/users/:userId/AppControlList',
      method: 'get',
    };

    this.serviceList['app.allowedDomains'] = {
      endpoint: this.API_SERVER_URL_PLATFORM + '/builder/allowedDomains',
      method: 'get',
    };
    this.serviceList['post.requestToDomains'] = {
      endpoint:
        this.API_SERVER_URL_PLATFORM + '/builder/requestToDomains?type=:type',
      method: 'post',
    };
    /** Get Account Configuration API */
    this.serviceList['app.account-configuratuion'] = {
      endpoint:
        this.API_SERVER_URL_PLATFORM + '/findly/users/:userId/accountConfigs',
      method: 'get',
    };
    /** Get Account Configuration API */
    this.serviceList['get.findly.apps'] = {
      endpoint: this.API_SERVER_URL + '/findlyai/apps',
      method: 'get',
    };
    this.serviceList['create.app'] = {
      //endpoint: this.API_SERVER_URL + '/users/:userId/builder/streams',
      endpoint: this.API_SERVER_URL + '/findly/apps',
      method: 'post',
    };
    this.serviceList['get.appData'] = {
      //endpoint: this.API_SERVER_URL + '/users/:userId/builder/streams/:streamId',
      //endpoint: this.API_SERVER_URL + 'findly/users/:userId/builder/streams/:streamId',
      endpoint: this.API_SERVER_URL + 'findly/apps/:streamId',
      method: 'get',
    };
    this.serviceList['jwt.grunt.generate'] = {
      endpoint: this.API_SERVER_URL,
      method: 'post',
    };
    this.serviceList['bt.post.sts'] = {
      endpoint: this.API_SERVER_URL + '/users/sts',
      method: 'post',
    };
    this.serviceList['get.apps'] = {
      endpoint: this.API_SERVER_URL + '/findly/apps',
      method: 'get',
    };
    this.serviceList['get.source.list'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/list?extractionType=:type&skip=:offset&limit=:limit',
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/extract/sources/:extractionSourceId/executionHistory?extractionType=:type',
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/:type/source?limit=:limit&skip=:skip',
      method: 'post',
    };
    this.serviceList['train.app'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/train',
      method: 'post',
    };
    this.serviceList['stopTrain.app'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/:searchIndexId/train/stopTrain/:jobId',
      method: 'put',
    };
    this.serviceList['get.extracted.pags'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/content/source/:sourceType/:webDomainId/:contentType?limit=:limit&skip=:skip',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/:webDomainId/content/list?skip=:skip&limit=:limit',
      method: 'post',
    };
    this.serviceList['get.extracted.pagsById'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/:webDomainId/content/:contentId',
      method: 'get',
    };
    this.serviceList['delete.content.page'] = {
      //endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/content/source/:sourceType/:webDomainId/:contentType/:pageId',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/:sourceId/content/:contentId',
      method: 'delete',
    };
    this.serviceList['delete.content.source'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/:sourceId',
      //endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/content/source/:webDomainId?type=:type',
      method: 'delete',
    };
    //  **/ clicksViews for FAQ */
    this.serviceList['get.clicksViews'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/:searchIndexId/faq/:faqId/analyse',
      method: 'get',
    };
    //  **/ clicksViews for Content */
    this.serviceList['get.clicksViewsContent'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/content/:contentId/analyse',
      method: 'get',
    };

    this.serviceList['update.contentPageSource'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/:sourceId',
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/content/source/document/:docId',
      method: 'put',
    };
    this.serviceList['get.job.status'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/extract/sources?extractionType=:type',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/jobs/status?extractionType=:type',
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/:type/source/status',
      method: 'get',
    };
    this.serviceList['get.job.statusById'] = {
      endpoint: this.API_SERVER_URL + '/findly/jobs/:jobId/status',
      method: 'get',
    };
    this.serviceList['findly.seed.data'] = {
      //endpoint: this.API_SERVER_URL_PLATFORM + '/users/:userId/builder/seed_data',
      endpoint: this.API_SERVER_URL + '/findly/seed_data',
      method: 'get',
    };
    this.serviceList['get.token'] = {
      endpoint: this.API_SERVER_URL + '/sso/token',
      method: 'get',
    };
    this.serviceList['post.fileupload'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/file',
      method: 'post',
    };
    // Multiple File Upload
    this.serviceList['post.multiplefileupload'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/bulk?extractionType=:type',
      method: 'post',
    };
    //
    this.serviceList['add.sourceMaterial'] = {
      //endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/extract?extractionType=:resourceType',
      //endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/:type/sources',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract?extractionType=:resourceType',
      method: 'post',
    };
    this.serviceList['add.sourceMaterialManualFaq'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract?extractionType=:type&contentSource=:faqType',
      // endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/:type/source?sourceType=:faqType',
      method: 'post',
    };
    this.serviceList['add.sourceMaterialFaq'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract?extractionType=:type&contentSource=:faqType',
      // endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/:type/source?sourceType=:faqType',
      method: 'post',
    };

    // cancel annotation
    this.serviceList['put.cancelAnnotation'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/:searchIndexId/jobs/:jobId/status',
      method: 'put',
    };

    this.serviceList['put.EditConfig'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/content/source/webdomain/:webdomainId',
      method: 'put',
    };
    this.serviceList['get.allFaqs'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/faq/list?skip=:offset&limit=:limit&source=all',
      method: 'get',
    };
    this.serviceList['get.allFaqsByState'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/faq/list?skip=:offset&state=:state&limit=:limit&source=all',
      method: 'get',
    };
    this.serviceList['get.faqs.search'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/faq/list?skip=:offset&state=:state&limit=:limit&source=all&search=:searchQuary',
      method: 'get',
    };
    this.serviceList['get.allManualFaqsByState'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/faq/list?skip=:offset&state=:state&limit=:limit&source=manual',
      method: 'get',
    };
    this.serviceList['get.faqs.searchManual'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/faq/list?skip=:offset&state=:state&limit=:limit&source=manual&search=:searchQuary',
      method: 'get',
    };
    this.serviceList['get.allFaqsByResources'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/faq/list?skip=:offset&limit=:limit&state=:state&extractionSourceId=:resourceId&serach=:searchQuary',
      method: 'get',
    };
    this.serviceList['get.faqsByResourcesState'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/faq/list?skip=:offset&state=:state&limit=:limit&extractionSourceId=:resourceId',
      method: 'get',
    };
    this.serviceList['addRemove.faqs'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/faq/:faqId/stage?action=:method',
      method: 'put',
    };
    this.serviceList['update.faq'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/faq/:faqId',
      method: 'put',
    };
    this.serviceList['add.comment'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/:sourceId/content/:faqId/comments',
      method: 'post',
    };
    this.serviceList['get.comments'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/:sourceId/content/:faqId/comments',
      method: 'get',
    };
    this.serviceList['delete.faq'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/faq/:faqId',
      method: 'delete',
    };
    this.serviceList['delete.faq'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/faq/:faqId',
      method: 'delete',
    };
    this.serviceList['get.knowledgetasks'] = {
      endpoint:
        this.API_SERVER_URL +
        '/users/:userId/builder/knowledgetasks?streamId=:streamId',
      method: 'get',
    };
    this.serviceList['create.knowledgetask'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/knowledgetasks',
      method: 'post',
    };
    this.serviceList['get.faqStatics'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/faq/stats',
      method: 'get',
    };
    this.serviceList['get.faqStaticsByResourceFilter'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/faq/stats?extractionSourceId=:resourceId',
      method: 'get',
    };
    this.serviceList['get.faqStaticsManualFilter'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/faq/stats?source=:resourceId',
      method: 'get',
    };
    this.serviceList['get.fags'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/faqs?ktId=:ktId',
      method: 'get',
    };

    this.serviceList['get.getorsearchfaq'] = {
      endpoint:
        this.API_SERVER_URL +
        '/users/:userId/builder/faqs?ktId=:ktId&limit=:limit&offset=:offSet&search=:searchParam&parentId=:parentId&withallchild=:withallchild&type=:filter',
      method: 'get',
    };

    this.serviceList['create.faqs'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/faqs',
      method: 'post',
    };

    this.serviceList['edit.faq'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/builder/faqs/:faqID',
      method: 'put',
    };
    this.serviceList['get.possibletags'] = {
      endpoint:
        this.API_SERVER_URL +
        '/users/:userId/builder/faqs/possibletags?ktId=:ktId',
      method: 'post',
    };

    this.serviceList['get.globalsynonyms'] = {
      endpoint:
        this.API_SERVER_URL +
        '/users/:userId/streams/:streamId/builder/globalsynonyms?offset=:offset&limit=:limit&search=:search&keyword=:keyword&state=:state&ktId=:ktId',
      method: 'get',
    };

    this.serviceList['delete.faq.ind'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/faq/:faqId',
      method: 'delete',
    };
    this.serviceList['delete.faq.source'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/:searchIndexId/faq/source/:sourceId',
      method: 'delete',
    };
    this.serviceList['update.faq.bulk'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/faq/bulk',
      method: 'put',
    };
    this.serviceList['update.manualFaqs.bulk'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/:searchIndexId/faq/bulk?source=manual',
      method: 'put',
    };
    this.serviceList['create.synonym'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/synonyms',
      method: 'post',
    };
    this.serviceList['get.synonym'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/synonyms?offset=:offset&limit=:limit',
      method: 'get',
    };
    this.serviceList['update.synonym'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/:searchIndexId/synonyms/:synonymId',
      method: 'put',
    };
    this.serviceList['delete.synonym'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/:searchIndexId/synonyms/:synonymId',
      method: 'delete',
    };
    this.serviceList['get.bots'] = {
      endpoint:
        this.API_SERVER_URL + '/platform/builder/streams/:streamId/allTasks',
      method: 'get',
    };
    this.serviceList['get.traitgroup'] = {
      endpoint:
        this.API_SERVER_URL +
        '/users/:userId/builder/streams/:streamId/traitgroup',
      method: 'get',
    };
    this.serviceList['post.traitgroup'] = {
      endpoint:
        this.API_SERVER_URL +
        '/users/:userId/builder/streams/:streamId/traitgroup',
      method: 'post',
    };
    this.serviceList['get.autoTrainStatus'] = {
      endpoint:
        this.API_SERVER_URL +
        '/users/:userId/bt/streams/:streamId/autoTrainStatus?sentences=true&speech=false',
      method: 'get',
    };
    this.serviceList['create.group'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/groups',
      method: 'post',
    };
    this.serviceList['get.groups'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/:searchIndexId/groups?offset=0&limit=50',
      method: 'get',
    };
    this.serviceList['updateBulk.group'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/groups/:groupId',
      method: 'put',
    };
    this.serviceList['update.group'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/groups/:groupId',
      method: 'put',
    };
    this.serviceList['delete.group'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/groups/:groupId',
      method: 'delete',
    };
    this.serviceList['create.rule'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/rules',
      method: 'post',
    };
    this.serviceList['get.rules'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/:searchIndexId/rules?offset=0&limit=50',
      method: 'get',
    };
    this.serviceList['update.rule'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/rules/:ruleId',
      method: 'put',
    };
    this.serviceList['updateBulk.rule'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/rules/bulk',
      method: 'put',
    };
    this.serviceList['delete.rule'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/rules/:ruleId',
      method: 'delete',
    };
    this.serviceList['get.allGroups'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/groups?offset=:offset&limit=:limit',
      method: 'get',
    };
    /** Crwaler  */
    this.serviceList['create.crawler'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/content/source?',
      method: 'post',
    };
    this.serviceList['update.crawler'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/:sourceId',
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/content/source/:sourceType/:sourceId',
      method: 'put',
    };
    /* Annotation tool */
    this.serviceList['attachment.file'] = {
      endpoint: this.API_SERVER_URL + '/attachment/file/:fileId/url',
      method: 'get',
    };
    this.serviceList['PdfAnno.get.userguide'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:streamId/getSavedAnnotatedDataForStream',
      method: 'get',
    };
    this.serviceList['PdfAnno.faq.annotate'] = {
      // endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/extract?extractionType=faq&contentSource=:sourceType',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/:sourceId/annotate',
      method: 'put',
    };
    this.serviceList['PdfAnno.faq.annotateExtract'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/:sourceId/start',
      method: 'post',
    };
    this.serviceList['PdfAnno.get.reAnnotateData'] = {
      // endpoint: this.API_SERVER_URL + '/builder/:streamId/:fileId/getSavedAnnotatedData',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/:sourceId/getSavedAnnotatedData',
      method: 'get',
    };

    /* Service End-Points for Integrating APIs in bot-action Component */
    this.serviceList['get.AssociatedBots'] = {
      endpoint: this.API_SERVER_URL + '/platform/users/:userID/builder/streams',
      method: 'get',
    };
    this.serviceList['get.AssociatedBotTasks'] = {
      // endpoint: this.API_SERVER_URL + '/builder/streams/:botID/dialogs',
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/allTasks',
      method: 'get',
    };
    this.serviceList['get.allTasks'] = {
      endpoint:
        this.API_SERVER_URL + '/platform/builder/streams/:streamId/allTasks',
      method: 'get',
    };
    this.serviceList['get.generateChannelCreds'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/searchbot/linkbot/generateChannelCreds',
      method: 'get',
    };
    this.serviceList['put.configLinkbot'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/:searchIndexID/searchbot/linkbot',
      method: 'put',
    };
    this.serviceList['put.LinkBot'] = {
      // endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/linkedbotdetails',
      endpoint:
        this.API_SERVER_URL + '/findly/:searchIndexID/searchbot/linkbot',
      method: 'put',
    };
    this.serviceList['put.UnlinkBot'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/searchbot/unlink',
      method: 'put',
    };
    this.serviceList['put.enableTask'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/linkedbotdetails',
      method: 'put',
    };
    this.serviceList['put.enableST'] = {
      endpoint: this.API_SERVER_URL + '/findly/apps/:streamId',
      method: 'put',
    };
    this.serviceList['put.disableTask'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/linkedbotdetails',
      method: 'put',
    };
    this.serviceList['put.syncLinkedBot'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/:searchIndexID/linkedbotdetails/sync',
      method: 'put',
    };
    this.serviceList['get.queryPipelines'] = {
      // endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/queryPipeline',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline',
      method: 'get',
    };
    this.serviceList['create.queryPipeline'] = {
      // endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/queryPipeline',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline',
      method: 'post',
    };
    this.serviceList['put.queryPipeline'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId',
      method: 'put',
    };
    this.serviceList['get.queryPipeline'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId',
      method: 'get',
    };
    this.serviceList['get.platformStages'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/:searchIndexID/indexPipeline/stages',
      method: 'get',
    };
    this.serviceList['get.indexpipelineStages'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId',
      method: 'get',
    };
    this.serviceList['get.indexPipeline'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/indexPipeline',
      method: 'get',
    };
    this.serviceList['post.indexPipeline'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/indexPipeline',
      method: 'post',
    };
    this.serviceList['put.indexPipeline'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId?deleteSnippetExtractionStage=:deleteSnippetExtractionStage',
      method: 'put',
    };
    this.serviceList['post.reindex'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/reIndex',
      method: 'post',
    };
    this.serviceList['post.simulate'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/simulate',
      method: 'post',
    };
    this.serviceList['post.restoreStopWord'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/setDefaults?stage=stopwords',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/setDefaults?stage=stopwords',
      method: 'put',
    };
    this.serviceList['post.restoreWeights'] = {
      // endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/setDefaults?stage=weights',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/setDefaults?stage=weights',
      method: 'put',
    };
    this.serviceList['post.enableStopWords'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId?enableStopWords=:enable',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId?enableStopWords=:enable',
      method: 'post',
    };
    this.serviceList['get.traits'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/traitgroup?skip=:offset&limit=:limit',
      method: 'get',
    };
    this.serviceList['update.traitGroup'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/traitgroup/:traitGroupId',
      method: 'put',
    };
    this.serviceList['create.traitGroup'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/traitgroup',
      method: 'post',
    };
    this.serviceList['delete.traitGroup'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/traitgroup/:traitGroupId',
      method: 'delete',
    };
    this.serviceList['delete.bulkTraits'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/traitgroup/bulk',
      method: 'delete',
    };
    this.serviceList['get.traitGroupById'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/traitgroup/:traitGroupId',
      method: 'get',
    };
    this.serviceList['update.traitById'] = {
      endpoint:
        this.API_SERVER_URL +
        '/users/:userId/builder/streams/:streamId/traitgroup/:traitGroupId/traits/:traitId',
      method: 'put',
    };
    this.serviceList['post.createField'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/fields',
      method: 'post',
    };
    this.serviceList['post.allField'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/fields/list?offset=:offset&limit=:limit',
      method: 'post',
    };
    this.serviceList['get.allFieldsData'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/fields',
      method: 'get',
    };
    this.serviceList['get.allSearchField'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/fields?offset=:offset&limit=:limit&search=:search',
      method: 'get',
    };
    this.serviceList['get.getFieldById'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/fields/:fieldId',
      method: 'get',
    };
    this.serviceList['get.getFieldUsage'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/fields/:fieldId/usage?queryPipelineId=:queryPipelineId',
      method: 'get',
    };
    this.serviceList['put.updateField'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/fields/:fieldId',
      method: 'put',
    };
    this.serviceList['delete.deleteField'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/fields/:fieldId',
      method: 'delete',
    };
    this.serviceList['get.getFieldAutocomplete'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/fields/autocomplete?alpha=:query&isIndexed=true',
      method: 'get',
    };
    this.serviceList['get.getFieldAutocompleteIndices'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/fields/autocomplete?alpha=:query&isIndexed=true&category=:category',
      method: 'get',
    };
    this.serviceList['get.allFacets'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/facets/?offset=:offset&limit=:limit',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/facets/?offset=:offset&limit=:limit',
      method: 'get',
    };
    this.serviceList['post.allFacets'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/facets/?offset=:offset&limit=:limit',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId//facets/list',
      method: 'post',
    };
    this.serviceList['create.facet'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/facets/',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/facets/',
      method: 'post',
    };
    this.serviceList['reorder.facets'] = {
      // endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/facets/facetOrder',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/facets/facetOrder',
      method: 'put',
    };
    this.serviceList['update.facet'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/facets/:facetId',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/facets/:facetId',
      method: 'put',
    };
    this.serviceList['update.facet'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/facets/:facetId',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/facets/:facetId',
      method: 'put',
    };
    this.serviceList['delete.facet'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/facets/:facetId',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/facets/:facetId',
      method: 'delete',
    };
    this.serviceList['get.facetValues'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/facets/:facetId',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:sidx/indexPipeline/:indexPipelineId/fields/:fieldId/values',
      method: 'get',
    };
    this.serviceList['delete.bulkFacet'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/facets/bulk',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/facets/bulk',
      method: 'delete',
    };
    this.serviceList['get.extractedResult_RR'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/resultSearch?skip=:skip&limit=:limit',
      method: 'post',
    };
    this.serviceList['get.QueryLevelAnalytics'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/search/analytics?startDate=:startDate&endDate=:endDate',
      method: 'post',
    };
    this.serviceList['update.rankingPinning'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/queryPipeline/:queryPipelineId/rankingAndPinning',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/rankingAndPinning',
      method: 'post',
    };
    this.serviceList['recrwal'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/:sourceId/recrawl',
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/content/source/:sourceId/recrawl?resourceType=:sourceType',
      method: 'post',
    };
    this.serviceList['get.page_detail'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/:sourceId',
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/content/source/:sourceId/recrawl?resourceType=:sourceType',
      method: 'get',
    };
    this.serviceList['train.traits'] = {
      endpoint:
        this.API_SERVER_URL +
        '/users/:userId/builder/sentences/ml/train?streamId=:streamId',
      method: 'post',
    };
    this.serviceList['get.queryCustomizeList'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/queryPipeline/:queryPipelineId/queryCustomisations?limit:limit&skip:skip',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/queryCustomisations?limit=:limit&skip=:skip',
      method: 'get',
    };
    this.serviceList['put.restoreQueryCustomize'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/queryPipeline/:queryPipelineId/rankingAndPinning/:rankingAndPinningId/restore',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/rankingAndPinning/:rankingAndPinningId/restore',
      method: 'put',
    };
    this.serviceList['get.rankingActionLog'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/logs?subject=rankingAndPinning&queryPipelineId=:queryPipelineId&rankingAndPinningId=:rankingAndPinningId&limit=20&skip=0',
      method: 'get',
    };
    this.serviceList['get.customisationLogs'] = {
      // endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/queryPipeline/:queryPipelineId/rankingAndPinning/:rankingAndPinningId/customisationLogs?limit=20&skip=0',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/rankingAndPinning/:rankingAndPinningId/customisationLogs?limit=20&skip=0',
      method: 'get',
    };
    this.serviceList['reset.bulkCustomization'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/queryPipeline/:queryPipelineId/rankingAndPinning/restore',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/rankingAndPinning/restore',
      method: 'put',
    };
    this.serviceList['delete.CustomizatioLog'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/queryPipeline/:queryPipelineId/rankingAndPinning/:rankingAndPinningId/content/:contentId',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/rankingAndPinning/:rankingAndPinningId/content/:contentId',
      method: 'delete',
    };
    /** get API for Metrics */

    this.serviceList['get.queries'] = {
      /*passing indexPipelineId for the analytics based indices added on 17/01  */
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/:indexPipelineId/metrics/Analysis?offset=:offset&limit=:limit',
      method: 'post',
    };
    this.serviceList['get.userChart'] = {
      /*passing indexPipelineId for the analytics based indices added on 24/01  */
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/:indexPipelineId/metrics/analysis',
      method: 'post',
    };

    /** get API for Metrics */

    /** APIs for Business rules */
    (this.serviceList['get.businessRules'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/rulesp?offset=:offset&limit=:limit',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/rulesp?offset=:offset&limit=:limit',
      method: 'get',
    }),
      (this.serviceList['post.businessRules'] = {
        //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/rulesp?offset=:offset&limit=:limit',
        endpoint:
          this.API_SERVER_URL +
          '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/rulesp/list?offset=:offset&limit=:limit',
        method: 'post',
      }),
      (this.serviceList['create.businessRules'] = {
        //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/rulesp',
        endpoint:
          this.API_SERVER_URL +
          '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/rulesp',
        method: 'post',
      }),
      (this.serviceList['get.businessRuleById'] = {
        //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/rulesp/:ruleId',
        endpoint:
          this.API_SERVER_URL +
          '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/rulesp/:ruleId',
        method: 'get',
      });
    this.serviceList['update.businessRule'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/rulesp/:ruleId',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/rulesp/:ruleId',
      method: 'put',
    };
    this.serviceList['delete.businessRule'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/rulesp/:ruleId',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/rulesp/:ruleId',
      method: 'delete',
    };
    this.serviceList['delete.businessRulesBulk'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/rulesp/bulk',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/rulesp/bulk',
      method: 'delete',
    };
    this.serviceList['get.businessRulesLog'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/logs?subject=rules',
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/logs?subject=rules',
      method: 'get',
    };
    this.serviceList['get.entities'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:sidx/indexPipeline/:fip/queryPipeline/:queryPipelineId/entities',
      method: 'get',
    };
    this.serviceList['post.entities'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:sidx/indexPipeline/:fip/queryPipeline/:queryPipelineId/entities/add',
      method: 'post',
    };
    this.serviceList['put.entities'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:sidx/indexPipeline/:fip/queryPipeline/:queryPipelineId/entities/:entityId',
      method: 'put',
    };
    this.serviceList['delete.entities'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:sidx/indexPipeline/:fip/queryPipeline/:queryPipelineId/entities',
      method: 'delete',
    };
    /** APIs for Business rules */

    /** APIs for Channels */
    this.serviceList['get.marketStream'] = {
      endpoint: this.API_SERVER_URL + '/market/streams',
      method: 'get',
    };
    this.serviceList['get.credential'] = {
      endpoint:
        this.API_SERVER_URL +
        '/users/:userId/streams/:streamId/sdk/apps?getAppsUsage=:true',
      method: 'get',
    };
    this.serviceList['create.createCredential'] = {
      endpoint:
        this.API_SERVER_URL + '/users/:userId/streams/:streamId/sdk/apps',
      method: 'post',
    };
    this.serviceList['configure.credential'] = {
      //endpoint: this.API_SERVER_URL + '/users/:userId/builder/streams/:streamId/channels/rtm',
      endpoint: this.API_SERVER_URL + '/findly/apps/:streamId/channels/rtm',
      method: 'post',
    };
    this.serviceList['edit.credential'] = {
      //endpoint: this.API_SERVER_URL + '/users/:userId/builder/streams/:streamId/channels/rtm',
      endpoint:
        this.API_SERVER_URL +
        '/users/:userId/streams/:streamId/sdk/apps/:sdkAppId?streamId=:streamId&rnd=vs4wdk',
      method: 'put',
    };
    this.serviceList['get.dialog'] = {
      endpoint: this.API_SERVER_URL + '/builder/streams/:streamId/dialogs',
      method: 'get',
    };
    this.serviceList['standard.publish'] = {
      endpoint:
        this.API_SERVER_URL + '/builder/streams/:streamId/standardpublish',
      method: 'post',
    };
    this.serviceList['universal.publish'] = {
      endpoint:
        this.API_SERVER_URL +
        '/users/:userId/builder/streams/:streamId/universalbot/publish?',
      method: 'post',
    };
    this.serviceList['get.linkedBot'] = {
      endpoint:
        this.API_SERVER_URL +
        '/platform/users/:userId/builder/streams/:streamId',
      method: 'get',
    };
    this.serviceList['get.embededSdk'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/users/:userId/streams/:streamId/embedwebsdk',
      method: 'get',
    };
    this.serviceList['post.updateEmbededSdk'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/users/:userId/streams/:streamId/embedwebsdk',
      method: 'post',
    };

    this.serviceList['manage.credentials'] = {
      endpoint:
        this.API_SERVER_URL +
        '/users/:userId/streams/:streamId/sdk/apps?getAppsUsage=:true',
      method: 'get',
    };
    this.serviceList['delete.credential'] = {
      endpoint:
        this.API_SERVER_URL +
        '/users/:userId/streams/:streamId/sdk/apps/:appId',
      method: 'delete',
    };
    this.serviceList['get.executionHistory'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/:extractionSourceId/executionHistory?extractionType=:sourceType&offset=:skip&limit=:limit',
      method: 'get',
    };
    this.serviceList['get.overview'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/appOverview',
      method: 'get',
    };
    this.serviceList['stop.crwaling'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/:searchIndexId/crawler/stopCrawl/:jobId',
      method: 'put',
    };
    this.serviceList['reCrwal.website'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/crawler/reCrawlPage/source/:extractionSourceId/content/:contentId/job/:jobId',
      method: 'post',
    };
    this.serviceList['check.forUpdates'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/crawler/checkForUpdates/source/:extractionSourceId/content/:contentId',
      method: 'post',
    };
    // this.serviceList['edit.credential'] = {
    //   endpoint: this.API_SERVER_URL + ' /users/:userId/streams/:streamId/sdk/apps/:appId?streamId=:streamId',
    //    method: 'put'
    // }
    /** APIs for Channels */

    this.serviceList['manage.credentials'] = {
      endpoint:
        this.API_SERVER_URL +
        '/users/:userId/streams/:streamId/sdk/apps?getAppsUsage=:true',
      method: 'get',
    };
    this.serviceList['get.apiScopes'] = {
      endpoint: this.API_SERVER_URL + '/findly/stream/scopes',
      method: 'get',
    };
    this.serviceList['delete.credential'] = {
      endpoint:
        this.API_SERVER_URL +
        '/users/:userId/streams/:streamId/sdk/apps/:appId',
      method: 'delete',
    };
    this.serviceList['delete.credentialData'] = {
      endpoint: this.API_SERVER_URL + '/findly/apps/:streamId',
      method: 'put',
    };
    //APIs for experiments
    this.serviceList['get.experiment'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/experiments?state=:state&offset=:offset&limit=:limit&orderBy=:orderBy&sortBy=:sortBy',
      method: 'get',
    };
    this.serviceList['create.experiment'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/experiments',
      method: 'post',
    };
    this.serviceList['edit.experiment'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/experiments/:experimentId',
      method: 'put',
    };
    this.serviceList['delete.experiment'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/experiments/:experimentId',
      method: 'delete',
    };
    // this.serviceList['edit.credential'] = {
    //   endpoint: this.API_SERVER_URL + ' /users/:userId/streams/:streamId/sdk/apps/:appId?streamId=:streamId',
    //    method: 'put'
    // }
    // API for GET Docker Status
    this.serviceList['get.dockStatus'] = {
      /**updated below endpoint as per new contract for docstatus & execution histroy on 21/02 */
      // endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/dockStatus',
      //method: 'get'
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/jobs',
      method: 'get',
    };
    this.serviceList['get.version'] = {
      endpoint: this.API_SERVER_URL + '/findly/versionInfo',
      method: 'get',
    };
    this.serviceList['put.dockStatus'] = {
      /**updated below endpoint as per new contract for put.docstatus & execution histroy on 10/03 */
      // endpoint: this.API_SERVER_URL + '/builder/streams/:streamId/dockStatus/:dockId',
      endpoint: this.API_SERVER_URL + '/findly/:sidx/jobs/:jobId',
      method: 'put',
    };

    this.serviceList['add.structuredData'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract?extractionType=:type&contentSource=:file',
      method: 'post',
    };

    this.serviceList['get.structuredData'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/structuredData?limit=:limit&skip=:skip',
      method: 'get',
    };

    this.serviceList['delete.structuredData'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/:sourceId/content/:contentId',
      method: 'delete',
    };

    this.serviceList['delete.clearAllStructureData'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/structuredData',
      method: 'delete',
    };

    this.serviceList['update.structuredData'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/extract/sources/:sourceId/content/:contentId',
      method: 'put',
    };

    this.serviceList['get.searchStructuredData'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/structuredData/search?q=:searchQuery&limit=:limit&skip=:skip',
      method: 'post',
    };

    this.serviceList['post.searchStructuredData'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/structuredData/search?q=:searchQuery&limit=:limit&skip=:skip&advanceSearch=:advanceSearch',
      method: 'post',
    };

    this.serviceList['delete.dockById'] = {
      /**updated below endpoint as per new contract for docstatus & execution histroy on 21/02 */
      // endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/dockStatus/:id?statusType=:statusType',
      // method: 'delete'
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/jobs/:id/hide',
      // ?statusType=:statusType',
      method: 'put',
    };

    this.serviceList['delete.clearAllDocs'] = {
      /**updated below endpoint as per new contract for docstatus & execution histroy on 21/02 */
      // endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/dockStatus',
      // method: 'delete'
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/jobs/hide',
      method: 'put',
    };

    this.serviceList['read.dockStatus'] = {
      /**updated below endpoint as per new contract for docstatus & execution histroy on 21/02 */
      // endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/dockStatus/read',
      // method: 'put'
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/jobs/read',
      method: 'put',
    };

    this.serviceList['export.faq'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/faqs/export',
      method: 'post',
    };

    this.serviceList['import.faq'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/faqs/import',
      method: 'post',
    };
    this.serviceList['get.userinfo'] = {
      endpoint: this.API_SERVER_URL_PLATFORM + '/_resolve/user?id=:id',
      method: 'get',
    };
    this.serviceList['get.members'] = {
      //endpoint: this.API_SERVER_URL_PLATFORM + '/users/:userId/builder/streams/:streamId/getcodevelopers',
      endpoint:
        this.API_SERVER_URL_PLATFORM +
        '/findly/users/:userId/streams/:streamId/getcodevelopers',
      method: 'get',
    };
    this.serviceList['get.roles'] = {
      //endpoint: this.API_SERVER_URL_PLATFORM + '/users/:userId/builder/streams/:streamId/sharebot/getorgroles/organizations/:orgId',
      endpoint:
        this.API_SERVER_URL_PLATFORM +
        '/findly/users/:userId/streams/:streamId/shareApp/getorgroles/organizations/:orgId',
      method: 'get',
    };
    this.serviceList['put.members'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/users/:userId/streams/:streamId/shareApp',
      method: 'put',
    };
    this.serviceList['get.autoSuggestEmails'] = {
      endpoint:
        this.API_SERVER_URL_PLATFORM +
        '/findly/users/:userId/streams/:streamId/shareapp/getmanagedusers/organizations/:orgId',
      method: 'get',
    };
    this.serviceList['get.streamData'] = {
      endpoint: this.API_SERVER_URL + '/findly/apps/:streamId',
      method: 'get',
    };
    this.serviceList['get.crawljobOndemand'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexID/extract/sources/:sourceId/init',
      method: 'get',
    };
    this.serviceList['put.retryValidation'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/source/:sourceId/crawler/validateUrl',
      method: 'put',
    };
    //  this.serviceList['export.dockstatus'] = {
    //   endpoint: this.API_SERVER_URL + '/findly/streams/:streamId/dockStatus/:notificationsId',
    //   method: 'post'
    //  }
    //  this.serviceList['export.url'] = {
    //   endpoint: this.API_SERVER_URL + '/attachment/file/:fileId/url',
    //   method: 'get'
    //  }

    /** APIs for Search Interface Old API*/
    this.serviceList['get.SI_setting'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/resultviewsettings',
      method: 'get',
    };
    this.serviceList['get.SI_settingInterface'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/resultviewsettings?interface=:interface',
      method: 'get',
    };
    this.serviceList['get.SI_searchResultTemplate'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/resulttemplates/:templateId',
      method: 'get',
    };
    this.serviceList['post.SI_saveTemplate'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/resulttemplates/:interface/resultviewsettings',
      method: 'post',
    };
    this.serviceList['put.SI_saveTemplate_Id'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/resulttemplates/:templateId',
      method: 'put',
    };
    this.serviceList['put.SI_saveResultSettings'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/resultviewsettings',
      method: 'put',
    };
    this.serviceList['get.SI_allResultSettings'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/getresultviewsettings',
      method: 'get',
    };
    this.serviceList['put.SI_copyResultSettings'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/resultviewsettings/copyConfig',
      method: 'put',
    };
    /** APIs for Search Interface Old API*/

    /** APIs for Result Template New */
    this.serviceList['get.settingsByInterface'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/resultTemplateSettings?interface=:interface',
      method: 'get',
    };
    this.serviceList['get.settingsById'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/resultTemplateSettings/:settingsId',
      method: 'get',
    };
    this.serviceList['update.settings'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/resultTemplateSettings/:settingsId',
      method: 'put',
    };
    this.serviceList['copy.settings'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/resultTemplateSettings/:settingsId/copy?fromInterface=:fromInterface',
      method: 'post',
    };
    this.serviceList['post.templates'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/templates',
      method: 'post',
    };
    this.serviceList['get.templateById'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/templates/:templateId',
      method: 'get',
    };
    this.serviceList['update.template'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/templates/:templateId',
      method: 'put',
    };
    /** APIs for Result Template New */

    /** APIs for multiple Index */
    this.serviceList['get.indexPipeline'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/indexPipeline',
      method: 'get',
    };
    this.serviceList['post.newIndexPipeline'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/indexPipeline',
      method: 'post',
    };
    this.serviceList['put.newIndexPipeline'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId',
      method: 'put',
    };
    this.serviceList['delete.indexPipeline'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId',
      method: 'delete',
    };
    this.serviceList['delete.queryPipeline'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPIpelineId',
      method: 'delete',
    };
    this.serviceList['get.checkInExperiment'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/validateDelete',
      method: 'get',
    };
    /** APIs for search experience and tour guide */
    this.serviceList['get.searchexperience.list'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/searchInterface',
      method: 'get',
    };
    this.serviceList['put.searchexperience'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/searchInterface',
      method: 'put',
    };
    this.serviceList['get.tourConfig'] = {
      endpoint: this.API_SERVER_URL + '/findly/apps/:streamId',
      method: 'get',
    };
    this.serviceList['put.tourConfig'] = {
      endpoint: this.API_SERVER_URL + '/findly/apps/:streamId',
      method: 'put',
    };
    /** Pricing **/
    this.serviceList['get.pricingPlans'] = {
      endpoint: this.API_SERVER_URL + '/findly/plans',
      method: 'get',
    };
    this.serviceList['get.currentPlans'] = {
      endpoint: this.API_SERVER_URL + '/findly/streams/:streamId/subscription',
      method: 'get',
    };
    this.serviceList['post.payement'] = {
      endpoint: this.API_SERVER_URL + '/findly/plans/:planId/checkout',
      method: 'post',
    };
    this.serviceList['get.payementStatus'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/streams/:streamId/transactions/:transactionId/status',
      method: 'get',
    };
    this.serviceList['post.usageData'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/streams/:streamId/subscription/usage',
      method: 'post',
    };
    this.serviceList['get.allInvoices'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/streams/:streamId/invoices?skip=:skip&limit=:limit&sortByInvoiceDate=:sortByInvoiceDate',
      method: 'get',
    };
    this.serviceList['get.allUsageLogs'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/streams/:streamId/subscription/usageLog?skip=:skip&limit=:limit',
      method: 'get',
    };
    this.serviceList['get.usageLogs.search'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/streams/:streamId/subscription/usageLog?skip=:skip&limit=:limit&search=:searchQuary',
      method: 'get',
    };
    this.serviceList['post.exportUsageLog'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/streams/:streamId/subscription/usageLog/export',
      method: 'post',
    };
    this.serviceList['put.buyOverage'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/streams/:streamId/subscription/:subscriptionId/overage',
      method: 'put',
    };
    this.serviceList['put.cancelSubscribtion'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/streams/:streamId/subscription/cancel',
      method: 'put',
    };
    this.serviceList['get.renewSubscribtion'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/streams/:streamId/subscription/renew',
      method: 'get',
    };
    this.serviceList['put.planChange'] = {
      endpoint: this.API_SERVER_URL + '/findly/plans/change',
      method: 'put',
    };
    this.serviceList['get.lastActiveSubscription'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/streams/:streamId/subscription/lastactive',
      method: 'get',
    };
    this.serviceList['get.getInvoiceDownload'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/streams/:streamId/transactions/:transactionId/invoice',
      method: 'get',
    };
    this.serviceList['post.downgradeCancellation'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/streams/:streamId/subscription/cancel/downgrade',
      method: 'post',
    };
    // Filters API
    this.serviceList['post.filters'] = {
      //endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/facets/?offset=:offset&limit=:limit',
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/getFilters',
      method: 'post',
    };
    //download invoice for paid plans
    this.serviceList['get.paidInvoiceDownload'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/streams/:streamId/invoices/:orderId',
      method: 'get',
    };
    //request for enterprise plan
    this.serviceList['post.enterpriseRequest'] = {
      endpoint: this.API_SERVER_URL + '/findly/streams/:streamId/eplead',
      method: 'post',
    };
    /** Inline Manual API */
    this.serviceList['get.inlineManual'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/inlineManual',
      method: 'get',
    };
    this.serviceList['put.updateInlineManual'] = {
      endpoint: this.API_SERVER_URL + '/findly/:searchIndexId/inlineManual',
      method: 'put',
    };
    /** Inline Manual API */
    //request for enterprise plan
    this.serviceList['put.upgradeBannerRead'] = {
      endpoint: this.API_SERVER_URL + '/findly/streams/:streamId/readBanner',
      method: 'put',
    };
    this.serviceList['get.synonyms'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/synonyms/list?offset=:offset&limit=:limit',
      method: 'post',
    };
    /** Delete apps API */
    this.serviceList['delete.app'] = {
      //endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/content/source/:sourceType/:webDomainId/:contentType/:pageId',
      endpoint: this.API_SERVER_URL + '/findly/apps/:streamId',
      method: 'delete',
    };
    /** Remove Access apps API */
    this.serviceList['Unlink.app'] = {
      //endpoint:this.API_SERVER_URL + '/findly/:searchIndexId/content/source/:sourceType/:webDomainId/:contentType/:pageId',
      endpoint: this.API_SERVER_URL + '/findly/apps/:streamId/unlinkApp',
      method: 'delete',
    };
    /** create Demo app API */
    this.serviceList['post.createDemoApp'] = {
      endpoint: this.API_SERVER_URL + '/findly/createDemoApp',
      method: 'post',
    };
    // Connectors API'S
    this.serviceList['get.connectors'] = {
      endpoint: this.API_SERVER_URL + '/findly/:sidx/connectors',
      method: 'get',
    };
    this.serviceList['get.connectorById'] = {
      endpoint: this.API_SERVER_URL + '/findly/:sidx/connectors/:fcon',
      method: 'get',
    };
    this.serviceList['post.connector'] = {
      endpoint: this.API_SERVER_URL + '/findly/:sidx/connectors',
      method: 'post',
    };
    this.serviceList['post.authorizeConnector'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/:sidx/connectors/:fcon/authorize',
      method: 'post',
    };
    this.serviceList['put.connector'] = {
      endpoint: this.API_SERVER_URL + '/findly/:sidx/connectors/:fcon',
      method: 'put',
    };
    this.serviceList['get.callbackConnector'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/connectors/callback?searchIndexId=:searchIndexId&connectorId=:connectorId&code=:code&state=:state',
      method: 'get',
    };
    this.serviceList['delete.connector'] = {
      endpoint: this.API_SERVER_URL + '/findly/:sidx/connectors/:fcon',
      method: 'delete',
    };
    this.serviceList['post.ingestConnector'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/:sidx/connectors/:fcon/queue-content',
      method: 'post',
    };
    this.serviceList['get.contentData'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:searchIndexId/connectors/:connectorId/content?offset=:offset&q=:q&limit=:limit',
      method: 'get',
    };
    this.serviceList['post.disableConnector'] = {
      endpoint: this.API_SERVER_URL + '/findly/:sidx/connectors/:fcon/disable',
      method: 'post',
    };
    this.serviceList['get.connectorJob'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:sidx/connectors/:fcon/jobs?limit=:limit',
      method: 'get',
    };
    this.serviceList['get.checkNewUser'] = {
      endpoint: this.API_SERVER_URL + '/findly/account?accountId=:accountId',
      method: 'get',
    };
    //export structure data faq
    this.serviceList['export.structuredData'] = {
      endpoint:
        this.API_SERVER_URL + '/findly/:searchIndexId/structuredData/export',
      method: 'post',
    };
    //get all list of field properties
    this.serviceList['get.allsearchFields'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/fields?search=:search&sortBy=:sortBy&orderBy=:orderBy&page=:page&limit=:limit',
      method: 'get',
    };

    //edit field properties
    this.serviceList['put.updatesearchFieldsProperties'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/field/:fieldId',
      method: 'put',
    };
    this.serviceList['put.indexLanguages'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:streamId/indexPipeline/:indexPipelineId/settings',
      method: 'put',
    };
    //get presentable list elements
    this.serviceList['get.presentableFields'] = {
      // endpoint: this.API_SERVER_URL +'/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/presentable?page=:page&limit=:limit&isSelected=:isSelected&orderBy=:orderType&sortBy=:sortField&isSearchable=:isSearchable&search=:searchKey',
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/presentable?isSelected=:isSelected&orderBy=:orderType&sortBy=:sortField&search=:searchKey',
      method: 'get',
    };
    //add presentable elements
    this.serviceList['add.presentableFields'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/presentable',
      method: 'put',
    };
    //delete Presentable elements
    this.serviceList['delete.presentableFields'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/presentable/field/:fieldId',
      method: 'delete',
    };

    //* Highlight API's */

    //get highlight list elements
    this.serviceList['get.highlightFields'] = {
      // endpoint: this.API_SERVER_URL +'/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/highlights?page=:page&limit=:limit&isSelected=:isSelected&orderBy=:orderType&sortBy=:sortField&isSearchable=:isSearchable&search=:searchKey',
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/highlights?isSelected=:isSelected&orderBy=:orderType&sortBy=:sortField&search=:searchKey',
      method: 'get',
    };

    //Add Highlight Fields
    this.serviceList['add.highlightFields'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/highlights',
      method: 'put',
    };

    //delete Highlight Fields
    this.serviceList['delete.highlightFields'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/highlights/field/:fieldId',
      method: 'delete',
    };

    //**Spellcorrect API's */

    //get spellcorrect list elements
    this.serviceList['get.spellcorrectFields'] = {
      // endpoint: this.API_SERVER_URL +'/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/spell-correct?page=:page&limit=:limit&isSelected=:isSelected&orderBy=:orderType&sortBy=:sortField&isSearchable=:isSearchable&search=:searchKey',
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/spell-correct?isSelected=:isSelected&orderBy=:orderType&sortBy=:sortField&search=:searchKey',
      method: 'get',
    };

    //add spell-correct Fields
    this.serviceList['add.spellcorrectFields'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/spell-correct',
      method: 'put',
    };

    //delete Spell_correct Fields
    this.serviceList['delete.spellcorrectFields'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/spell-correct/field/:fieldId',
      method: 'delete',
    };
    //Apis for Index settings module

    //Api request for seedDAta of Languages Available
    this.serviceList['get.indexAvailableLanguages'] = {
      endpoint: this.API_SERVER_URL + '/findly/seed_data?languages=true',
      method: 'get',
    };
    this.serviceList['put.indexLanguages'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/settings',
      method: 'put',
    };

    //Apis for Index settings module ends

    //Apis for Weights module starts

    //API request for getting List of Weights
    this.serviceList['get.weightsList'] = {
      // endpoint: this.API_SERVER_URL +'/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/weights?page=:pageNo&limit=:noOfRecords&isSelected=:isSelected',
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/weights?isSelected=:isSelected&orderBy=:orderType&sortBy=:sortField',
      method: 'get',
    };
    this.serviceList['get.sortWeightsList'] = {
      // endpoint: this.API_SERVER_URL +'/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/weights?page=:pageNo&limit=:noOfRecords&isSelected=:isSelected',
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/weights?isSelected=:isSelected&orderBy=:orderBy&sortBy=:sortBy',
      method: 'get',
    };
    //API request for getting List of Searchable fields
    this.serviceList['get.fieldsList'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/weights?isSelected=:isSelected&isSearchable=:isSearchable',
      method: 'get',
    };
    //API request for updating  Weight
    this.serviceList['put.updateWeight'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/weights/field/:fieldId',
      method: 'put',
    };
    //API request for delete  Weight
    this.serviceList['delete.Weight'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/weights/field/:fieldId',
      method: 'delete',
    };
    // API Reset Weights List
    this.serviceList['put.restoreWeights'] = {
      // endpoint: this.API_SERVER_URL + '/findly/:searchIndexID/queryPipeline/:queryPipelineId/setDefaults?stage=weights',
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/weights/setDefault',
      method: 'put',
    };
    ////Apis for Weights module  ends

    //Apis for Stop Words module starts
    // Api for default stop wrods
    this.serviceList['get.defaultStopWords'] = {
      endpoint: this.API_SERVER_URL + '/findly/seed_data?stopwords=true',
      method: 'get',
    };
    //Api for getting stopwords List
    this.serviceList['get.stopWordsList'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/stopwords?languageCode=:code',
      method: 'get',
    };
    //Api for Adding or Editing stopwords List
    this.serviceList['put.createStopWords'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/stopwords',
      method: 'put',
    };
    //Api for deleteing stopwords List
    this.serviceList['delete.deleteStopWords'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/stopwords',
      method: 'delete',
    };

    //Apis for Stop Words module ends

    //Api for getting synonyms List
    this.serviceList['get.synonyms'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/synonyms?languageCode=:code&orderBy=:orderType&sortBy=:sortField&type=:synonymType&search=:searchKey',
      method: 'get',
    };
    //Apis for Synonyms module starts
    this.serviceList['put.addSynonym'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/synonyms',
      method: 'put',
    };
    this.serviceList['put.EditSynonym'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/synonyms/:synonymId',
      method: 'put',
    };
    this.serviceList['delete.synonymn'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/synonyms/:synonymId',
      method: 'delete',
    };

    //Apis for Synonyms module ends

    //Search Settings Usage API for presenatble,highlight,spellcorrect
    this.serviceList['get.searchSettingsUsage'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/stream/:streamId/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/searchField/:fieldId/usage',
      method: 'get',
    };

    //API's for answer Snippets module
    this.serviceList['get.answerSnippets'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:sidx/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/snippets',
      method: 'get',
    };
    this.serviceList['put.answerSnippets'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:sidx/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/snippets',
      method: 'put',
    };
    this.serviceList['get.openAIKey'] = {
      endpoint: this.API_SERVER_URL + '/findly/stream/:streamId/integrations',
      method: 'get',
    };
    this.serviceList['post.openAIKey'] = {
      endpoint: this.API_SERVER_URL + '/findly/stream/:streamId/integrations',
      method: 'post',
    };
    this.serviceList['post.simulateTest'] = {
      endpoint:
        this.API_SERVER_URL +
        '/findly/:sidx/indexPipeline/:indexPipelineId/queryPipeline/:queryPipelineId/snippets/simulate',
      method: 'post',
    };
  }
}