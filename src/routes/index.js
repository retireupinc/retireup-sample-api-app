import Dashboard from "./Dashboard";
import Analysis from "./Analysis";
import Investments from "./Investments";
import Login from "./Login";
import Logout from "./Logout";
import Error from "./Error";

const routes = [
  {
    path: "/",
    menuItemLabel: "Dashboard",
    component: Dashboard,
    exact: true,
  },
  {
    path: "/analysis",
    menuItemLabel: "Analysis",
    component: Analysis,
    exact: true,
  },
  {
    path: "/investments",
    menuItemLabel: "Investments",
    component: Investments,
    exact: true,
  },
  {
    path: "/login",
    component: Login,
    exact: true,
  },
  {
    path: "/logout",
    menuItemLabel: "Logout",
    component: Logout,
    exact: true,
  },
  {
    component: Error,
  },
];

export default routes;
