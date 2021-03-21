import { useState, useEffect, useCallback } from "react";
import { fetchPlanByTagName } from "../../utils/ApiClient";
import MainPageHeader from "../../components/MainPageHeader";
import LoadingOverlay from "../../components/LoadingOverlay";
import Spinner from "../../components/Spinner";
import DashboardContext from "./DashboardContext";
import IncomeGraph from "./IncomeGraph";
import Toolbar from "./Toolbar";

const BOOMER_W_CASH = "BOOMER_W_CASH";
const defaultToolbarOptions = {
  example: BOOMER_W_CASH,
  yearType: "allYears",
};
const defaultFetchingStatus = {
  isFetching: false,
};

function Dashboard(props) {
  const [toolbarOptions, setToolbarOptions] = useState(defaultToolbarOptions);
  const [household, setHousehold] = useState();
  const [plan, setPlan] = useState();
  const [fetchingStatus, setFetchingStatus] = useState(defaultFetchingStatus);

  const fetchPlan = useCallback(
    (tagName) => {
      setFetchingStatus({ isFetching: true });
      fetchPlanByTagName(tagName)
        .then(({ household, plan }) => {
          setHousehold(household);
          setPlan(plan);
          setFetchingStatus({ isFetching: false });
        })
        .catch((err) => {
          setFetchingStatus({ isFetching: false, err });
          alert(err.message);
          console.log(err);
        });
    },
    [setHousehold, setPlan]
  );

  useEffect(() => {
    fetchPlan(BOOMER_W_CASH);
  }, []);

  if (!household || !plan || !plan?.outcome) {
    return <MainPageHeader label="Timeline" />;
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
          fetchPlan,
        }}
      >
        <MainPageHeader
          label="Timeline"
          render={(props) => <Toolbar {...props} />}
        />
        <IncomeGraph />
      </DashboardContext.Provider>
      {fetchingStatus.isFetching && (
        <LoadingOverlay roundBottom={true}>
          <Spinner />
        </LoadingOverlay>
      )}
    </>
  );
}

export default Dashboard;
