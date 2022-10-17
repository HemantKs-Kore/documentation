import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WorkflowService } from './workflow.service';

@Injectable({
  providedIn: 'root'
})
export class ParentBridgeService {
  public parentEvent = new Subject<any>();
  constructor() { 
    this.registerEventsFromParent();
  }
  private windowElement: any;
  registerEventsFromParent() {
    let self=this;
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    eventer(messageEvent, function (e) {
        if (e.data && e.data.action) {
            var data = e.data;
            self.parentEvent.next(data);
            console.log("TOpic Guide ---",data)
        }
    }, false);
}
}
