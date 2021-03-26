import { createContext } from "react";
import useAuth from "../hooks/useAuth";

export const authContext = createContext({
  auth: null,
  setAuthStatus: () => {},
  setUnauthStatus: () => {},
});

const { Provider } = authContext;

const AuthProvider = ({ userAuthStorage, children }) => {
  const { auth, setAuthStatus, setUnauthStatus } = useAuth(
    userAuthStorage.get(),
    userAuthStorage
  );
  return (
    <Provider value={{ auth, setAuthStatus, setUnauthStatus }}>
      {children}
    </Provider>
  );
};

export default AuthProvider;
