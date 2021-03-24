import { useContext } from "react";
import { Switch } from "react-router-dom";
import { authContext } from "./contexts/AuthContext";
import routes from "./routes";
import Header from "./components/Header";
import SideBar from "./components/SideBar";

function renderRoutes() {
  return (
    <Switch>
      {routes.map((route, i) => (
        <route.component key={i} {...route} />
      ))}
    </Switch>
  );
}

function PrivateLayout(props) {
  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row">
          <SideBar />
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            {renderRoutes()}
          </main>
        </div>
      </div>
    </>
  );
}

function GuestLayout(props) {
  return renderRoutes();
}

function App() {
  const { auth } = useContext(authContext);
  return auth.isAuthenticated ? <PrivateLayout /> : <GuestLayout />;
}

export default App;
