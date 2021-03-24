import { useContext, useMemo } from "react";
import { Route, Redirect } from "react-router-dom";
import { authContext } from "../contexts/AuthContext";
import { getLoginReturnUrl } from "../utils";

function withGuestRoute(WrappedComponent) {
  function WithGuestRoute(route) {
    const { auth } = useContext(authContext);
    const currentUrl = window.location.href;
    console.log(currentUrl);
    const returnUrl = useMemo(() => getLoginReturnUrl(currentUrl), [
      currentUrl,
    ]);

    console.log(returnUrl);

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
