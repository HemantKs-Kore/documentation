==============================================================================================================
0 lint
0 audit
0 console issues

// How to optimize application for performance
install plugins recommanded by vscode (Findly/koreai/.vscode/extensions.json), and follow the suggestions
any new feature should be lazy loaded ( as of now all screens are lazy loaded )
api calls should not be duplicated ( refer apps.component, no further apps call once its fetched )
any static constants should be internatinalized and lazy loaded ( refer apps.component)
use global style as much as possible, override in component if required
images should be lazy loaded ( refer apps.component )
==============================================================================================================

1.  bootstrap & ngx-bootstrap update needed
2.  mixpanel added by HeaderModule
3.  moment added in main bundle from mainmenu
4.  index.html is no main land, respect it
5.  scripts move to lazy bundle
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
6.                        "apps/searchassist/src/app/helpers/lib/assets/marked.min.js", removed as not used anywhere as of now.
7.  Styling

- Global style for the app
- bootstrap js not required ( hence popper js )
- Single styling library ( bootstrap, Material )
- Single font library ( si-font , material icon, bootstrap icon )

8. codemirror should be lazy loaded
   // main.ts
   import 'codemirror/mode/javascript/javascript';
   import 'codemirror/addon/fold/foldgutter';
   import 'codemirror/addon/fold/brace-fold';
   import 'codemirror/lib/codemirror';
   import 'codemirror/addon/edit/closebrackets';
   import 'codemirror/addon/edit/matchbrackets';
   import 'codemirror/addon/lint/lint';
   import 'codemirror/addon/lint/json-lint';
   import 'codemirror/addon/lint/javascript-lint';
   import 'codemirror/addon/hint/javascript-hint';

// styles.scss
@import '~codemirror/lib/codemirror';
@import '~codemirror/theme/neo';
@import '~codemirror/lib/codemirror';
@import '~codemirror/addon/fold/foldgutter';
@import '~codemirror/addon/lint/lint';

9. project.json
   "apps/searchassist/src/app/helpers/lib/assets/highlight.js/highlight.min.js",
   "apps/searchassist/src/assets/js/bootstrap-slider.js",
   "apps/searchassist/src/assets/web-kore-sdk/libs/purejscarousel.js"

   removed, moved to correct location

10. createAppPop ( same create app component duplicated header, apps)
