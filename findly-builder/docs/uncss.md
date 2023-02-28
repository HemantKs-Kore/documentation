# UNCSS

```
npm run uncss
```

## Safelisting

```javascript
// tools/purgecss.config.js
// Specific selectors
// the selectors .random, #yep, button will be left in the final CSS
safelist: ['random', 'yep', 'button']

// Patterns
safelist: {
  standard: [/red$/], // selectors ending with red
  deep: [/blue$/], // selectors ending with blue as well as their children
  greedy: [/yellow$/] // selectors that have any part ending with yellow
}
```
