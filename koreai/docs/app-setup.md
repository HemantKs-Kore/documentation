# Setup

**prerequisite**

NODEJS: https://nodejs.org/dist/v19.6.0/node-v19.6.0-x64.msi

GIT: https://git-scm.com/download/win

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

## Prod Server ( run prod build locally )

```
// one time
npm i live-server -g
```

update Findly/koreai/apps/searchassist/src/app/services/end-points.service.ts

```javascript
// this.SERVER_URL = window.location.protocol + '//' + window.location.host;
this.SERVER_URL = 'https://searchassist-qa.kore.ai';
```

```
npm run build
cd dist/apps/searchassist
live-server
http://127.0.0.1:8080/
```
