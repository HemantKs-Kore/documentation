import { isDevMode } from '@angular/core';

function marketURL() {
  return window.location.protocol + '//' + window.location.host + '/accounts';
}

// export function getLoginRedirectURL() {
//   return marketURL();
//    +
//   '/?return_to=' +
//   location.href +
//   '&showLogin=true&hideSSOButtons=true&hideResourcesPageLink=true&comingFromKey=isSearchAssist'
// }

export function appInitializer() {
  return () => {
    return new Promise((resolve, reject) => {
      const isAuthenticated = localStorage['jStorage'];
      if (!isAuthenticated) {
        if (isDevMode()) {
          reject('Not Authenticated');
        } else {
          // redirect to the login page
          location.href = marketURL();
          reject(null);
        }
      }

      resolve(isAuthenticated);
    });
  };
}
