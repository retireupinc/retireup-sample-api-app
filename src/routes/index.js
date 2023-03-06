import Analysis from "./Analysis";
import Dashboard from "./Dashboard";
import Investments from "./Investments";
import Login from "./Login";
import Logout from "./Logout";
import NotFound from "./NotFound";

const routes = [
  {
    path: "/",
    Element: Dashboard,
  },
  {
    path: "/analysis",
    Element: Analysis,
  },
  {
    path: "/investments",
    Element: Investments,
  },
  {
    path: "/login",
    Element: Login,
    isPublic: true,
  },
  {
    path: "/logout",
    Element: Logout,
  },
  {
    path: "*",
    Element: NotFound,
  },
];

export default routes;
