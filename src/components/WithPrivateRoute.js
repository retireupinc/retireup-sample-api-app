import { useContext, useMemo } from "react";
import { Route, Redirect } from "react-router-dom";
import { authContext } from "../contexts/AuthContext";
import Header from "./Header";
import SideBar from "./SideBar";

function withPrivateRoute(WrappedComponent) {
  function WithPrivateRoute(route) {
    const { auth } = useContext(authContext);
    const currentUrl = window.location.href;
    const returnUrl = useMemo(() => {
      const url = new URL(currentUrl);
      const returnUrl = {
        pathname: "/login",
      };

      if (!url.pathname.startsWith("/logout")) {
        returnUrl.search = `?returnUrl=${encodeURIComponent(currentUrl)}`;
      }

      return returnUrl;
    }, [currentUrl]);

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
