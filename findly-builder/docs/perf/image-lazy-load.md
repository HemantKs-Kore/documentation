# Lazy load images

Step 1: Include `NgOptimizedImage` module 1st

```js
@NgModule({
  declarations: [PlanUpgradeComponent],
  imports: [
    NgOptimizedImage,
  ],
  exports: [PlanUpgradeComponent],
})
```

Step 2: change `src` to `ngSrc` and provide apropriate width and height to it, thats all.

```html
// before
<img src="assets/icons/modal-close.svg" />

// After
<img ngSrc="assets/icons/modal-close.svg" width="16" height="16" />
```

## Resources:

https://www.angularjswiki.com/angular/use-ngoptimizedimage-to-improve-image-loading-performance-in-angular/
