# Searchassist App Setup

## Prerequisite

NODEJS: https://nodejs.org/dist/v19.6.0/node-v19.6.0-x64.msi

GIT: https://git-scm.com/download/win

## Code Setup

```
git clone https://github.com/Koredotcom/Findly.git
cd Findly
git checkout Search_UI/FLY-5393_FieldsRevamp_UpgradeNG15
npm i --force
```

## Deelopment Server ( for developers only )

```
npm start
http://localhost:4200/
```

```javascript
// run exact prod build (no debug info ), remove following, rarly you want to do this
// npm run serve:app

  // "sourceMap": true,
  // "namedChunks": true

"app": {
  "fileReplacements": [
    {
      "replace": "apps/searchassist/src/environments/environment.ts",
      "with": "apps/searchassist/src/environments/environment.app.ts"
    }
  ],
  "sourceMap": true,
  "namedChunks": true
},
```

## Prod Server ( run prod build locally )

```javascript
npm run serve:app
http://127.0.0.1:8080/
```
