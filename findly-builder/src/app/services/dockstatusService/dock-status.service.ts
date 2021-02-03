import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { startWith } from 'rxjs/operators';

import * as _ from 'underscore';
@Injectable({providedIn: 'root'})

export class DockStatusService {

    selectedApp: any;
    showStatusDocker : boolean = false;

    constructor(
        private service: ServiceInvokerService,
        public workflowService: WorkflowService
    ) {
        this.selectedApp = this.workflowService.findlyApps();
    }

    getDockStatus(job: string) {
        const streamId = this.selectedApp._id || this.selectedApp[0]._id
        const params = {streamId};
        return Observable.create(observer=>{
            const polling = interval(5000).pipe(startWith(0)).subscribe(()=>{
                this.service.invoke('get.dockstatus', params).subscribe(res=>{
                    const jobObj = _.findWhere(res, {jobType: job});
                    if(jobObj && jobObj.status === 'SUCCESS') {
                        polling.unsubscribe();
                        observer.next(jobObj);
                    }
                    else if(jobObj && jobObj.status === 'FAILURE') {
                        polling.unsubscribe();
                        observer.error(new Error('Failed'));
                    }
                    else if(!jobObj) {
                        polling.unsubscribe();
                        observer.error(new Error('No JobType found!'));
                    }
                })
            })
        });
    }

    updateProgress(payload, _id: string) {
        const _params = {
            streamId: this.selectedApp._id || this.selectedApp[0]._id,
            dsId: _id
        };
        return Observable.create(observer => {
            this.service.invoke('put.updatedockstatus', _params, payload).subscribe(res=>{ observer.next(res) }, err => { observer.error(err); });
        })
    }

    downloadDockFile(fileId, fileName) {
        const params = {fileId};
        this.service.invoke('get.downloaddockfile', params).subscribe(res=>{
            const hrefURL = res.fileUrl + fileName;
            window.open(hrefURL);
        }, err=>{ console.log(err) });
    }

}