import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import SideBar from "./components/SideBar";
import { authContext } from "./contexts/AuthContext";
import routes from "./routes";

function renderRoutes() {
  return (
    <Routes>
      {routes.map(({ path, Element, isPublic }, i) => {
        if (isPublic) {
          return <Route path={path} element={<Element />} />;
        }

        return (
          <Route
            path={path}
            element={
              <RequireAuth>
                <Element />
              </RequireAuth>
            }
          />
        );
      })}
    </Routes>
  );
}

function PrivateLayout(props) {
  return (
    <>
      <SideBar />
      {renderRoutes()}
    </>
  );
}

function GuestLayout(props) {
  return renderRoutes();
}

function App() {
  const { auth } = useContext(authContext);
  return auth?.isAuthenticated ? <PrivateLayout /> : <GuestLayout />;
}

export default App;
