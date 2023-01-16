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

## Feature

- Global Styles for all possible apps
- Global Assets for all apps
- Lazy load external css
- Prettier code formatter
- Lazy load theme and component specific style
- Resolver to prefetch data before routing to page
