const authTokenKey = "paani_admin_token";

export function getStoredToken() {
  return window.localStorage.getItem(authTokenKey);
}

export function setStoredToken(token: string) {
  window.localStorage.setItem(authTokenKey, token);
}

export function clearStoredToken() {
  window.localStorage.removeItem(authTokenKey);
}
