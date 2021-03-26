import { DEFAULT_USER_AUTH, USER_AUTH_LOCAL_STORAGE_KEY } from "../constants";

// Local storage wrapper used to handle the access token.
const userAuthStorage = {
  set: (userAuth) => {
    window.localStorage.setItem(
      USER_AUTH_LOCAL_STORAGE_KEY,
      JSON.stringify(userAuth)
    );
  },
  get: () => {
    const authStr = window.localStorage.getItem(USER_AUTH_LOCAL_STORAGE_KEY);
    if (!authStr) {
      return { ...DEFAULT_USER_AUTH };
    }

    let auth;
    try {
      auth = JSON.parse(authStr);
    } catch (err) {}

    if (!auth || typeof auth !== "object") {
      this.remove();
      return { ...DEFAULT_USER_AUTH };
    } else if (auth && auth.accessTokenExpiresAt <= Date.now()) {
      return {
        ...auth,
        isAuthenticated: false,
      };
    }

    return auth;
  },
  remove: () => {
    window.localStorage.removeItem(USER_AUTH_LOCAL_STORAGE_KEY);
  },
};

export default userAuthStorage;
