import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MixpanelServiceService } from './mixpanel-service.service';

@Injectable({
  providedIn: 'root',
})
export class ParentBridgeService {
  public parentEvent = new Subject<any>();
  constructor(private mixpanel: MixpanelServiceService) {
    this.registerEventsFromParent();
  }
  private windowElement: any;
  registerEventsFromParent() {
    // const self: any = this;
    const eventMethod = window.addEventListener
      ? 'addEventListener'
      : 'attachEvent';
    const eventer = window[eventMethod];
    const messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';
    eventer(
      messageEvent,
      (e) => {
        if (e.data && e.data.action) {
          const data = e.data;
          this.parentEvent.next(data);
          //console.log("TOpic Guide ---",data);
          if (data?.payload?.url && data?.action == 'videoModal') {
            this.mixpanel?.postEvent('Topic - Play Topic Video', {
              'Video File URL': data?.payload?.url,
              'Topic Name': data?.payload?.topicName
                ? data?.payload?.topicName
                : data?.payload?.title,
            });
            //console.log("video",data?.payload?.topicName)
            console.log('Topic - Play Topic Video');
          } else if (data?.payload?.faqName && data?.action == 'faq') {
            this.mixpanel?.postEvent('Topic - FAQ Accessed', {
              'FAQ String': data?.payload?.faqName,
              'Topic Name': data?.payload?.topicName
                ? data?.payload?.topicName
                : data?.payload?.path?.split('/').pop(),
            });
            console.log('Topic - FAQ Accessed');
          } else if (data?.payload?.docUrl && data?.action == 'Documentation') {
            this.mixpanel?.postEvent('Topic - Documentation visited', {
              'Topic Name': data?.payload?.topicName
                ? data?.payload?.topicName
                : data?.payload?.path?.split('/').pop(),
            });
            console.log('Topic - Documentation visited');
          } else if (
            data?.frameStatus == 'loaded' &&
            data?.action == 'guidedTour'
          ) {
            this.mixpanel?.postEvent('Topic - Enter Topic Guide', {});
            console.log('Topic - Enter Topic Guide');
          }
        }
      },
      false
    );
  }
}
