function marketURL() {
  return location.hostname !== 'localhost'
    ? window.location.protocol + '//' + window.location.host + '/accounts'
    : null;
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
        // redirect to the login page
        const redirectUrl = marketURL();
        if (redirectUrl) {
          location.href = redirectUrl;
        }
        reject(null);
      }

      resolve(isAuthenticated);
    });
  };
}
