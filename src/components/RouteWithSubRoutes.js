import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { authContext } from "../contexts/AuthContext";

function RouteWithSubRoutes(route) {
  const { auth } = useContext(authContext);

  const { path } = route;
  if (path === "/login") {
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
            <route.component {...props} routes={route.routes} />
          )
        }
      />
    );
  }

  return (
    <Route
      path={route.path}
      render={(props) =>
        auth.isAuthenticated ? (
          <route.component {...props} routes={route.routes} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

export default RouteWithSubRoutes;
