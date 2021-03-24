import { useContext, useMemo } from "react";
import { Route, Redirect } from "react-router-dom";
import { authContext } from "../contexts/AuthContext";
import Header from "./Header";
import SideBar from "./SideBar";

function withPrivateRoute(WrappedComponent) {
  function WithPrivateRoute(route) {
    const { auth } = useContext(authContext);
    const currentUrlStr = window.location.href;
    const returnUrl = useMemo(() => {
      const currentUrl = new URL(currentUrlStr);
      const newReturnUrl = {
        pathname: "/login",
      };

      // Only set the return url if the login pathname does not have a query string
      // and we're also not currently in the logout pathname.
      if (
        currentUrl.pathname !== "/" &&
        currentUrl.pathname !== "/logout" &&
        !currentUrl.query
      ) {
        newReturnUrl.search = `?returnUrl=${encodeURIComponent(currentUrlStr)}`;
      }

      return newReturnUrl;
    }, [currentUrlStr]);

    return (
      <Route
        path={route.path}
        render={(props) =>
          auth.isAuthenticated ? (
            <>
              <Header />
              <div className="container-fluid">
                <div className="row">
                  <SideBar />
                  <main
                    role="main"
                    className="col-md-9 ml-sm-auto col-lg-10 px-md-4"
                  >
                    <WrappedComponent {...props} routes={route.routes} />
                  </main>
                </div>
              </div>
            </>
          ) : (
            <Redirect to={returnUrl} />
          )
        }
      />
    );
  }

  return WithPrivateRoute;
}

export default withPrivateRoute;
