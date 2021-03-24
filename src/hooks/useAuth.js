import { useState } from "react";
import { DEFAULT_USER_AUTH, USER_AUTH_LOCAL_STORAGE_KEY } from "../constants";

const useAuth = (initialState) => {
  const [auth, setAuth] = useState(initialState);
  const setAuthStatus = (userAuth) => {
    if (!userAuth || typeof userAuth !== "object") {
      throw new Error(`"userAuth" must be an object.`);
    }

    window.localStorage.setItem(
      USER_AUTH_LOCAL_STORAGE_KEY,
      JSON.stringify(userAuth)
    );
    setAuth(userAuth);
  };

  const setUnauthStatus = () => {
    window.localStorage.removeItem(USER_AUTH_LOCAL_STORAGE_KEY);
    setAuth({ ...DEFAULT_USER_AUTH });
  };

  return {
    auth,
    setAuthStatus,
    setUnauthStatus,
  };
};

export default useAuth;
