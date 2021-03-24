import { useContext, useMemo } from "react";
import { Route, Redirect } from "react-router-dom";
import { authContext } from "../contexts/AuthContext";

function withGuestRoute(WrappedComponent) {
  function WithGuestRoute(route) {
    const { auth } = useContext(authContext);
    const currentUrlStr = window.location.href;
    const returnUrl = useMemo(() => {
      const currentUrl = new URL(currentUrlStr);
      const returnUrlParam = currentUrl.searchParams.get("returnUrl");

      const newReturnUrl = {
        pathname: "/",
      };

      if (returnUrlParam) {
        const returnUrl = new URL(returnUrlParam);
        newReturnUrl.pathname = returnUrl.pathname;
        newReturnUrl.search = returnUrl.search;
      }

      return newReturnUrl;
    }, [currentUrlStr]);

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
