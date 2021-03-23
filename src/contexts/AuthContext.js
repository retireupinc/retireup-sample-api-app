import { createContext } from "react";
import useAuth from "../hooks/useAuth";
import { DEFAULT_USER_AUTH } from "../constants";
import { getStoredUserAuth } from "../utils/ApiClient";

export const authContext = createContext({
  auth: { ...DEFAULT_USER_AUTH },
  setAuthStatus: () => {},
  setUnauthStatus: () => {},
});

const { Provider } = authContext;

const AuthProvider = ({ children }) => {
  const { auth, setAuthStatus, setUnauthStatus } = useAuth(getStoredUserAuth());
  return (
    <Provider value={{ auth, setAuthStatus, setUnauthStatus }}>
      {children}
    </Provider>
  );
};

export default AuthProvider;
