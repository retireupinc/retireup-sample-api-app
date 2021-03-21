import { useState, useEffect } from "react";
import { fetchPlanByTagName } from "../../utils/ApiClient";
import MainPageHeader from "../..//components/MainPageHeader";
import DashboardContext from "./DashboardContext";
import IncomeGraph from "./IncomeGraph";
import Toolbar from "./Toolbar";

const BOOMER_W_CASH = "BOOMER_W_CASH";

function Dashboard(props) {
  const [toolbarOptions, setToolbarOptions] = useState({
    example: BOOMER_W_CASH,
    yearType: "allYears",
  });
  const [household, setHousehold] = useState();
  const [plan, setPlan] = useState();

  useEffect(() => {
    fetchPlanByTagName(BOOMER_W_CASH)
      .then(({ household, plan }) => {
        setHousehold(household);
        setPlan(plan);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setHousehold, setPlan]);

  if (!household || !plan || !plan?.outcome) {
    return (
      <>
        <MainPageHeader label="Timeline" />
      </>
    );
  }

  return (
    <>
      <DashboardContext.Provider
        value={{
          toolbarOptions,
          household,
          plan,
          setPlan,
          setHousehold,
          setToolbarOptions,
        }}
      >
        <MainPageHeader
          label="Timeline"
          render={(props) => <Toolbar {...props} />}
        />
        <IncomeGraph />
      </DashboardContext.Provider>
    </>
  );
}

export default Dashboard;
