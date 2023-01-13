import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WorkflowService } from './workflow.service';
import { MixpanelServiceService } from '@kore.services/mixpanel-service.service';

@Injectable({
  providedIn: 'root'
})
export class ParentBridgeService {
  public parentEvent = new Subject<any>();
  public mixpanel: MixpanelServiceService
  constructor() {
    this.registerEventsFromParent();
  }
  private windowElement: any;
  registerEventsFromParent() {
    const self: any =this;
    const eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    const eventer = window[eventMethod];
    const messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    eventer(messageEvent,  (e) => {
        if (e.data && e.data.action) {
            const data: any = e.data;
            self.parentEvent.next(data);
            console.log("TOpic Guide ---",data);
            if(data?.payload?.url && data?.action == "videoModal"){
              this.mixpanel.postEvent('Topic - Play Topic Video',{'Video File URL':data?.payload?.url, 'Topic Name': data?.payload?.topicName});
            } else if(data?.payload?.faqName && data?.action =='faq'){
              this.mixpanel.postEvent('Topic - FAQ Accessed',{'FAQ String': data?.payload?.faqName, 'Topic Name': data?.payload?.topicName});
            } else if(data?.payload?.docUrl && data?.action =='Documentation'){
              this.mixpanel.postEvent('Topic - Documentation visited',{'Topic Name': data?.payload?.topicName});
            } else if(data?.frameStatus == 'loaded' && data?.action =='guidedTour'){
              this.mixpanel.postEvent('Topic - Enter Topic Guide',{});
            }
        }
    }, false);
}
}
