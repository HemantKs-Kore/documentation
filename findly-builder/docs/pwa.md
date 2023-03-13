# PWA ( Progressive Web Application)

Web application with native like capabilities

```
ng add @angular/pwa --project <project-name>
```

```js
// configured
// apps\searchassist\src\app\app.module.ts
ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000',
}),

// Assets configuration
apps\searchassist\ngsw-config.json
```

## Performance

```json
// apps\searchassist\ngsw-config.json
"dataGroups": [
  {
    "name": "apps api",
    "urls": ["/apps"],
    "cacheConfig": {
      "strategy": "performance",
      "maxAge": "1d",
      "maxSize": 100
    }
  }
]
```

# Resources

https://angular.io/guide/service-worker-getting-started
