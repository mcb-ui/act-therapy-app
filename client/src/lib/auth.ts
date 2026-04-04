export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'user';
export const AUTH_STATE_CHANGE_EVENT = 'act-auth-state-change';

const parseTokenPayload = (token: string) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }

    return JSON.parse(window.atob(payload)) as { exp?: number };
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string) => {
  const payload = parseTokenPayload(token);
  if (!payload?.exp) {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
};

export const notifyAuthStateChanged = () => {
  window.dispatchEvent(new Event(AUTH_STATE_CHANGE_EVENT));
};

export const getStoredToken = () => {
  const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);

  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    clearStoredAuth();
    return null;
  }

  return token;
};

export const getStoredUser = () => {
  const user = window.localStorage.getItem(USER_STORAGE_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    clearStoredAuth();
    return null;
  }
};

export const setStoredAuth = (token: string, user: AuthUser) => {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  notifyAuthStateChanged();
};

export const clearStoredAuth = () => {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(USER_STORAGE_KEY);
  notifyAuthStateChanged();
};
