import { Switch } from "react-router-dom";
import routes from "./routes";
import AuthContextProvider from "./contexts/AuthContext";
import RouteWithSubRoutes from "./components/RouteWithSubRoutes";

function App() {
  return (
    <AuthContextProvider>
      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch>
    </AuthContextProvider>
  );
}

export default App;
