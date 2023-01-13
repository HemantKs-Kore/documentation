import { catchError } from 'rxjs/operators';
import { ServiceInvokerService } from '../service-invoker.service';
import { WorkflowService } from '../workflow.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()

export class PipelineDataResolver implements Resolve<any> {

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    let value = route.data['value'];
    const quaryparms: any = {
      isSelected:true,
      sortField: "fieldName",
      orderType: 'asc',
      indexPipelineId: this.workflowService.selectedIndexPipeline(),
      streamId: this.workflowService.selectedApp()?._id,
      queryPipelineId: this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
      searchKey: ''
    };

    return this.service.invoke(value, quaryparms)
      .pipe(
        catchError((error) => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ error });
        }),
      )
  }
}

@Injectable()
export class PipelineResolver implements Resolve<any> {

  constructor(
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    let value = route.data['pipeline'];
    const quaryparms: any = {
      indexPipelineId: this.workflowService.selectedIndexPipeline(),
      queryPipelineId: this.workflowService.selectedQueryPipeline() ? this.workflowService.selectedQueryPipeline()._id : '',
      searchIndexID: this.workflowService.selectedApp()?.searchIndexes[0]?._id,
    };

    if (quaryparms.queryPipelineId) {
      return this.service.invoke(value, quaryparms).pipe(delay(10));
    } else {
      return of(null);
    }
  }
}
