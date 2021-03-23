import { Switch } from "react-router-dom";
import routes from "./routes";
import AuthContextProvider from "./contexts/AuthContext";

function App() {
  return (
    <AuthContextProvider>
      <Switch>
        {routes.map((route, i) => (
          <route.component key={i} {...route} />
        ))}
      </Switch>
    </AuthContextProvider>
  );
}

export default App;
