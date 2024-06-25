export function isLoggedIn() {
  if (!sessionStorage.getItem('isSessionOngoing')) {
    if (localStorage.getItem('rememberMe') && localStorage.getItem('isLoggedIn')) {
      sessionStorage.setItem('isSessionOngoing', 'true');
      return true;
    } else {
      return false;
    }
  } else {
    if (localStorage.getItem('isLoggedIn') ? true : false) {
      sessionStorage.setItem('isSessionOngoing', 'true');
      return true;
    }
    return false;
  }
}
