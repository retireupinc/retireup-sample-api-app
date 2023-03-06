import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authContext } from "../contexts/AuthContext";

function RequireAuth({ children }) {
  let location = useLocation();
  const { auth } = useContext(authContext);
  if (!auth?.isAuthenticated) {
    let pathname = location.pathname === "/logout" ? "/" : location.pathname;

    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return (
      <Navigate
        to="/login"
        state={{ from: { ...location, pathname } }}
        replace
      />
    );
  }

  return <>{children}</>;
}

export default RequireAuth;
