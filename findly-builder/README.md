# Kore

```
npm start
npm run build
npm run lint
npm run test
npm run e2e

// generate fake api
npm run generate

// run fake api server
npm run server

// run bundle analyzer
npm run wba

// run source map explorer
npm run sme

// update angular
nx migrate latest
  - Make sure package.json changes make sense and then run 'npm install',
  - Run 'npx nx migrate --run-migrations'

// finally run mdc migration
ng generate @angular/material:mdc-migration
```

## Run prod build locally

```
npm run serve:app
```

## E2E

```
ng e2e searchassist-e2e --watch
ng e2e searchassist-e2e --configuration=production
```

## Generators

```
// generate e2e project
ng g cypress-project tiktik-e2e --project searchassist

// generate module with lazy route
ng g m test --route test --module app
```

## Lighthouse

https://github.com/GoogleChrome/lighthouse/blob/HEAD/docs/readme.md#using-programmatically

```
npm i lighthouse -g
chrome-debug
npm run perf:report
```

## Feature

- Global Styles for all possible apps
- Global Assets for all apps
- Lazy load external css
- Prettier code formatter
- Lazy load theme and component specific style
- Resolver to prefetch data before routing to page
- Documentation
- PWA

## Bundling Scripts

Don't forget to update `tools/build.js` if want to add new 3rd part script, and run `npm run buildjs` it's required only when new script added.

## Resources

1. Lazy load modules

https://www.wittyprogramming.dev/articles/lazy-load-component-angular-without-routing/

2. Why font icon over svg icon

https://betterprogramming.pub/inline-svg-or-icon-fonts-which-one-to-use-77c0daf1c527#:~:text=Both%20icon%20fonts%20and%20inline,look%20crisper%20on%20retina%20displays.

3. Budget

https://googlechrome.github.io/lighthouse/scorecalc/
