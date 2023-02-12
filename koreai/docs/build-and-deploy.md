# Searchassist Build

```
npm run build
```

it will run build with configuration `prod`, also trigger uncss script `postbuild` and generate `dist/apps/searchassist` this is what you need to serve as production build.

Build with critical css ( Best optimized build )

```
// it will build and launch live-serve, so puppeteer can analyze critical css
npm run serve:prod

// it will extract critical css from styles.32423487324.css and update index.html
// also it will update styles.32423487324.css with remaining unused css
npm run criticalCss
```
