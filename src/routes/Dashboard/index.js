import { useEffect } from "react";
import { fetchPlanByTagName } from "../../utils/ApiClient";

const BOOMER_W_CASH = "BOOMER_W_CASH";

function Dashboard() {
  useEffect(() => {
    fetchPlanByTagName(BOOMER_W_CASH);
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Dashboard</h1>
      </div>
      <div>Dashboard</div>
    </>
  );
}

export default Dashboard;
