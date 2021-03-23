import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { authContext } from "../contexts/AuthContext";
import Header from "./Header";
import SideBar from "./SideBar";

function withMainRoute(WrappedComponent) {
  function WithMainRoute(route) {
    const { auth } = useContext(authContext);
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

  return WithMainRoute;
}

export default withMainRoute;
