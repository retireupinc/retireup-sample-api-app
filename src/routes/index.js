import Dashboard from "./Dashboard";
import Analysis from "./Analysis";
import Investments from "./Investments";

const routes = [
  {
    path: "/",
    label: "Dashboard",
    component: Dashboard,
    exact: true,
  },
  {
    path: "/analysis",
    label: "Analysis",
    component: Analysis,
    exact: true,
  },
  {
    path: "/investments",
    label: "Investments",
    component: Investments,
    exact: true,
  },
];

export default routes;
