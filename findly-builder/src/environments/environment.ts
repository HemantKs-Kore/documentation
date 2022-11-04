// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  tag: 'dev',
  API_SERVER_URL: 'https://searchassist-qa.kore.ai',  
  USE_SESSION_STORE: false,
  INLINE_MANUAL_SITE_KEY: "1ec224ee46620656a9b18a17c80587a3",
  deployment_type:"",  
  APPCUES:{
    ENABLE : true,
    APPCUES_KEY : '112004'
  },
  // API_SERVER_URL: 'http://192.168.10.101:5000' 
  topicGuideBaseUrl:'https://koredotcom.github.io/koredotai-docs/searchassist/topic-guide/'
  // API_SERVER_URL: 'http://192.168.10.101:5000' 
  //testing purpose
  //topicGuideBaseUrl:'https://sunilsi-kore.github.io/koredotai-docs/searchassist/topic-guide/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI
