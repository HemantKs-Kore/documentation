## Using Pipeline

- code smell
- nested subscription

```js
// before
// 1.
ngOnInit(): void {
  this.selectedApp = this.workflowService?.selectedApp();
  this.serachIndexId = this.selectedApp?.searchIndexes[0]?._id;
  this.indexPipelineId = this.workflowService?.selectedIndexPipeline();
  this.queryPipelineId = this.workflowService?.selectedQueryPipeline()
    ? this.workflowService?.selectedQueryPipeline()?._id
    : '';
  if (this.indexPipelineId && this.queryPipelineId)
    this.getcustomConfigList();
  this.querySubscription =
    this.appSelectionService.queryConfigSelected.subscribe((res) => {
      this.indexPipelineId = this.workflowService?.selectedIndexPipeline();
      this.queryPipelineId = this.workflowService?.selectedQueryPipeline()
        ? this.workflowService.selectedQueryPipeline()?._id
        : '';
      this.getcustomConfigList();
    });
}

// 2.
getcustomConfigList() {
  this.getQuerypipeline();
}

// 3.
getQuerypipeline() {
  this.service.invoke('get.queryPipeline', quaryparms).subscribe(
}
```

## How to use

```js
ngOninit() {
  this.initAppIds();
}

initAppIds() {
  const idsSub = this.storeService.ids$
    .pipe(
      tap(({ streamId, searchIndexId, indexPipelineId, queryPipelineId }) => {
        this.streamId = streamId;
        this.searchIndexId = searchIndexId;
        this.indexPipelineId = indexPipelineId;
        this.queryPipelineId = queryPipelineId;
        this.getcustomConfigList();
      })
    )
    .subscribe();

  this.sub?.add(idsSub);
}
```

## Get index pipelines (list)

```js
  handlePipelineError(errRes) {
    if (
      errRes &&
      errRes.error.errors &&
      errRes.error.errors.length &&
      errRes.error.errors[0] &&
      errRes.error.errors[0].msg
    ) {
      this.notificationService.notify(
        errRes.error.errors[0].msg,
        'error'
      );
    } else {
      this.notificationService.notify('Failed ', 'error');
    }

    return EMPTY;
  }

  getIndexPipeline() {
    const indexPipelineSub = this.store
      .select(selectIndexPipelines)
      .pipe(
        tap((indexPipelines) => {
          this.indexConfigs = JSON.parse(JSON.stringify(res));

          if (indexPipelines.length > 0) {
            this.selectedIndexConfig = this.indexConfigs.find(
              (item) => item.default
            );

            this.getAllgraphdetails(this.selectedIndexConfig._id);
          }
        }),
        catchError(this.handlePipelineError)
      )
      .subscribe();

      this.sub?.add(indexPipelineSub);
  }
```
