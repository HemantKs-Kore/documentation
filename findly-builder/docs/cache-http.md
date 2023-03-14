# Cache Http (GET) calls

Just you need to send `cache` header.

```js
getAllPlans(): Observable<any> {
  return this.service
    .invoke('get.pricingPlans', null, null, { cache: 'cachable' })
}
```
