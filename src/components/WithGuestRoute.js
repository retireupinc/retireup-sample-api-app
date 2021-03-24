import { useContext, useMemo } from "react";
import { Route, Redirect } from "react-router-dom";
import { authContext } from "../contexts/AuthContext";

function withGuestRoute(WrappedComponent) {
  function WithGuestRoute(route) {
    const { auth } = useContext(authContext);
    const currentUrl = window.location.href;
    const returnUrl = useMemo(() => {
      const url = new URL(currentUrl);
      const returnUrlParam = url.searchParams.get("returnUrl");

      const returnUrl = {
        pathname: "/",
      };

      if (returnUrlParam) {
        const returnUrlParts = new URL(returnUrlParam);
        returnUrl.pathname = returnUrlParts.pathname;
        returnUrl.search = returnUrlParts.search;
      }

      return returnUrl;
    }, [currentUrl]);

    return (
      <Route
        path={route.path}
        render={(props) =>
          auth.isAuthenticated ? (
            <Redirect to={returnUrl} />
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
