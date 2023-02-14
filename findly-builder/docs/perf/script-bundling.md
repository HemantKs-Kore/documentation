# Bundling

`scripts.min.js` created by `npm run buildjs` script

if want to add new script, please update `tools/build.js`

it will concat/minify array of scripts and place inside `assets/js` directory. angular will use this folder for dev build, for production build you need to configure `Findly\koreai\apps\searchassist\project.json` with respective script that you wanted to be lazily loaded.

```javascript
"scripts": [
  {
    "input": "apps/searchassist/src/assets/js/scripts.min.js",
    "bundleName": "scripts.min",
    "inject": false
  }
],
```
