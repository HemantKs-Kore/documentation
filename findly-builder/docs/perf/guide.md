# Performance Guide

- RAIL

Load - within 1s
IDLE Time
Animation - 60fps - > 60ms total -> but for you its 8ms
Response Time

- Memory Leak
- Web Worker
- PWA
- IMMUTABILITY

## Load Time

1. Use Lazy Loading

```
ng g m users --route users --module app
```

2. Fold Content loading
3. Preload font
4. use only what you need fro 3rd part lib ( no jquery, moment, underscore)
5. optimize images
6. Optimize CSS
   Analyze with chrome fps
   https://web.dev/rendering-performance/
   https://csstriggers.com/
