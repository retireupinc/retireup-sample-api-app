import { Switch } from "react-router-dom";
import routes from "./routes";
import RouteWithSubRoutes from "./components/RouteWithSubRoutes";
import Header from "./components/Header";
import SideBar from "./components/SideBar";

function App() {
  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row">
          <SideBar />
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            <Switch>
              {routes.map((route, i) => (
                <RouteWithSubRoutes key={i} {...route} />
              ))}
            </Switch>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
