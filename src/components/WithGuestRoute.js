import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { authContext } from "../contexts/AuthContext";

function withGuestRoute(WrappedComponent) {
  function WithGuestRoute(route) {
    const { auth } = useContext(authContext);
    return (
      <Route
        path={route.path}
        render={(props) =>
          auth.isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            <WrappedComponent {...props} routes={route.routes} />
          )
        }
      />
    );
  }

  return WithGuestRoute;
}

export default withGuestRoute;
