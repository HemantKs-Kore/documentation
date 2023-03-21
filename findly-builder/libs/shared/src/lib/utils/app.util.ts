function marketURL() {
  return window.location.protocol + '//' + window.location.host + '/accounts';
}

export function getLoginRedirectURL() {
  return (
    marketURL() +
    '/?return_to=' +
    location.href +
    '&showLogin=true&hideSSOButtons=true&hideResourcesPageLink=true&comingFromKey=isSearchAssist'
  );
}
