// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  tag: 'pilot',
  API_SERVER_URL: 'https://searchassist-pilot.kore.ai',
  USE_SESSION_STORE: false,
  MIXPANEL_KEY: '5c3bf404d138a0e9ca816fb8421d6665',
  deployment_type: '',
  INLINE_MANUAL_SITE_KEY: '1ec224ee46620656a9b18a17c80587a3',
  APPCUES: {
    ENABLE: true,
    APPCUES_KEY: '112004',
  },
  topicGuideBaseUrl:
    'https://koredotcom.github.io/koredotai-docs/searchassist/topic-guide/',
  // topicGuideBaseUrl:'https://sunilsi-kore.github.io/koredotai-docs/searchassist/topic-guide/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
