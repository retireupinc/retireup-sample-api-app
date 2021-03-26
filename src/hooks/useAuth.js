import { useState } from "react";

const useAuth = (initialState, userAuthStorage) => {
  const [auth, setAuth] = useState(initialState);
  const setAuthStatus = (userAuth) => {
    if (!userAuth || typeof userAuth !== "object") {
      throw new Error(`"userAuth" must be an object.`);
    }

    userAuthStorage.set(userAuth);
    setAuth(userAuth);
  };

  const setUnauthStatus = () => {
    userAuthStorage.remove();
    setAuth({ ...userAuthStorage.get() });
  };

  return {
    auth,
    setAuthStatus,
    setUnauthStatus,
  };
};

export default useAuth;
