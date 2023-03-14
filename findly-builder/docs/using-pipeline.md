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
