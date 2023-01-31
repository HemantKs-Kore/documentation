===============================================================
0 lint
2 console error
any new feature should be lazy loaded
api calls should not be duplicated
===============================================================

1. bootstrap & ngx-bootstrap update needed
2. mixpanel added by HeaderModule
3. moment added in main bundle from mainmenu
4. index.html is no main land, respect it
5. scripts move to lazy bundle
   "apps/searchassist/src/app/helpers/lib/assets/highlight.js/highlight.min.js",
   "apps/searchassist/src/app/helpers/lib/assets/marked.min.js",
   "apps/searchassist/src/assets/js/bootstrap-slider.js",
   "apps/searchassist/src/assets/web-kore-sdk/libs/purejscarousel.js",
   "node_modules/rangy/lib/rangy-core.js",
   "node_modules/rangy/lib/rangy-classapplier.js",
   "node_modules/rangy/lib/rangy-highlighter.js",
   "node_modules/rangy/lib/rangy-selectionsaverestore.js",
   "node_modules/rangy/lib/rangy-serializer.js",
   "node_modules/rangy/lib/rangy-textrange.js"
6.
