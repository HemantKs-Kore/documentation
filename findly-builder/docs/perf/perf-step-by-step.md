# Why this upgrade

We can't ignore following for any kind of user...

1. Performance
2. Security
3. Scalibility - keeps application optimal in longer run

For Dev Team upgrade also matters a lot...

1. Faster Dev/Prod Build
2. Better Tooling

More detailed analysis I am attaching please go through it and let me know if you have any different thought on it.

Just upgrade analysis https://github.com/Koredotcom/Findly/blob/SearchAssist/NGUpdate14/findly-builder/docs/perf.md

# How to optimize application for performance

We started with this thought "Load something only when it's needed"

So 1st we analyzed our application for performance with chrome dev tool ( performance, memory, lighthouse, performance monitor, web vitals) it gave us enough info about what was the main performance bottleneck.

Answer was simple - bundle size

So to analyze bundle size we configured these bundling tools....

1. Webpack bundle analyzer
2. Sourcemap explorer

Using this we got to know which module is affecting our bundle size, In fact everything was included in main bundle means we were loading lot of unnecessary modules bundle that's completely not needed for landing page

So this is what we did next....

1. Angular Upgrade version 15 ( reduce angular & it's eco system bundle sizes ), it was necessary as it opened the door for service worker, web worker, the way we lazy load component, modals etc.
2. We started lazy loading modules ( load on demand )
   we stared with child component lazy loading but that din't help us in improving performance of landing page, because our main bundle was still loading big chunk of code that was used in lazy module.

3. Lazy Load Modules
   So we started optimizing main bundle ....

- moved all components to lazy loaded modules, it helped us a lot in reducing main bundle size now only left over item in main bundle is... - header ( it's still big as it use following, means all of these going to be part of main bundle... )
  // modules
  NgbProgressbarModule,
  PerfectScrollbarModule,
  FormsModule,
  KrModalModule,
  NgbTooltipModule,
  NgbDropdownModule,
  SharedPipesModule,
  OnboardingModule,
  NgbTypeaheadModule,
  SliderModule,

          // Services ( for ex.  MixpanelServiceService included pixpanel npm package that increase bundle size)
          authService: AuthService,
          SideBarService,
          WorkflowService,
          AppUrlsService,
          LocalStoreService,
          ServiceInvokerService,
          NotificationService,
          MixpanelServiceService,
          DockStatusService,
          AppSelectionService,
          SearchSdkService,

4. Script Optimization
   After lazy load module we found our bundle size bigger as it was including 3rd party scripts it was increasing our bundle size, so we deffered its loading....

- Our index.html was including lot of script that was related to Search SDK so we have created a search sdk component that we loaded when user hits "Preview" button 1st time. (~4MB reduction)
- At this point we realized codemirror used only in lazy modules we created so we removed it completetly from "main.ts" and it's styles from "styles.scss" and loaded in modules it was needed
- As these script are still part of main bundle so we created bundle out of these and deferred its loading, it was not straight forward, we created build script ans lazy load script service for it

  // Step 1 - create bundle `npm run buildjs` ( need to be executed only when you add/update any of script going forward)

  ```js
  const scriptsArr = [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/popper.js/dist/umd/popper.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'apps/searchassist/src/app/helpers/lib/assets/highlight.js/highlight.min.js',
    'apps/searchassist/src/assets/js/bootstrap-slider.js',
    'apps/searchassist/src/assets/js/appcues.js',
    'node_modules/mixpanel-browser/dist/mixpanel-jslib-snippet.min.js',
  ];
  ```

  // Step 2- Load script when needed, this will load and make it part of global script as it used to be. ( import jquery from 'jquery' dosn't help)

  ```js
  //apps.component.ts
    loadScripts() {
      this.lazyLoadService.loadScript('scripts.min.js').subscribe(() => {

      });
    }
  ```

  - We did same for rangy as it should be part of global window, else we might have loaded in lazy module directly

  ```js
  const rangyArr = [
    'node_modules/rangy/lib/rangy-core.js',
    'node_modules/rangy/lib/rangy-classapplier.js',
    'node_modules/rangy/lib/rangy-highlighter.js',
    'node_modules/rangy/lib/rangy-selectionsaverestore.js',
    'node_modules/rangy/lib/rangy-serializer.js',
    'node_modules/rangy/lib/rangy-textrange.js',
  ];
  ```

5. CSS Optimization
   Nice improvement in performance and good reduction in bundle size, our css bundle size was still bothering us serving ~1.75mb of css for landing page

- We have included css in index.html, some were in `styles` section in `angular.json`

To reduce css bundle size...

- this 1.75MB of styles is whole aplication components style, after lazy loading modules it's now 0, nothing special
- Now if lazy loading all possible css bundles

```css
        "styles": [
          "apps/searchassist/src/scss/styles.scss",
          {
            "input": "scss/themes/dark.scss",
            "bundleName": "dark-theme",
            "inject": false
          },
          {
            "input": "apps/searchassist/src/scss/components/codemirror.scss",
            "bundleName": "codemirror.min",
            "inject": false
          },
          {
            "input": "apps/searchassist/src/scss/components/lang.scss",
            "bundleName": "lang.min",
            "inject": false
          },
          {
            "input": "apps/searchassist/src/scss/components/searchsdk.scss",
            "bundleName": "searchsdk.min",
            "inject": false
          },
          {
            "input": "apps/searchassist/src/scss/components/vendor.scss",
            "bundleName": "vendor.min",
            "inject": false
          }
        ],

```

For ex `https://searchassist-qa.kore.ai/home/styles.e01cdf20dba1c93b3e3e.css` is `410kb`( it's not all css ) now its `348kb` ( all css )

To lazy load styles we again using same LazyLoadService we used to load scripts...

```js
  lazyLoadCodeMirror(): Observable<any[]> {
    return this.lazyLoadService.loadStyle('codemirror.min.css');
  }
```

6. Image Optimization ( 60 images -> 10 images)

62 images for landing page that was a lot, it's good indication that we rendering a lot than needed ( remember images loaded only when it's rendered)

We lazy loaded images to make the count 10 ( but rendering html that's not needed need to be addresed )

https://github.com/Koredotcom/Findly/blob/Search_UI/FLY-5393_FieldsRevamp_UpgradeNG15/findly-builder/docs/perf/image-lazy-load.md

7. Lazy I18N

I18N messages size increase exponentially we understand it, so started loading i18n messages lazily for lazy loaded features.

How its implemented please visit https://github.com/Koredotcom/Findly/blob/Search_UI/FLY-5393_FieldsRevamp_UpgradeNG15/findly-builder/docs/i18n.md

8. Reduce Un-necessary Http Requests, we did it for apps we are listing on landing page.
9. Included PWA - to cache static assests

```
ng add @angular/pwa --project searchassist
```

10. After Build Optimization

- Uncss
- critical CSS

```
npm run uncss
npm run criticalCss
```
