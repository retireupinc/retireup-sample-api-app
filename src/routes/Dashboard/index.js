import { useState, useEffect, useCallback } from "react";
import { Spinner } from "react-bootstrap";
import { fetchPlanByTagName } from "../../utils/ApiClient";
import withMainRoute from "../../components/WithMainRoute";
import MainPageHeader from "../../components/MainPageHeader";
import { LoadingOverlay } from "../../components/Styled";
import DashboardContext from "./DashboardContext";
import IncomeGraph from "./IncomeGraph";
import IncomeTable from "./IncomeTable";
import Toolbar from "./Toolbar";

const BOOMER_W_CASH = "BOOMER_W_CASH";
const defaultToolbarOptions = {
  example: BOOMER_W_CASH,
  viewType: "graph",
  yearType: "allYears",
};
const defaultFetchingStatus = {
  isFetching: false,
};

function Dashboard(props) {
  const [toolbarOptions, setToolbarOptions] = useState({
    ...defaultToolbarOptions,
    defaults: { ...defaultToolbarOptions },
  });
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!household || !plan || !plan?.outcome) {
    return (
      <>
        <MainPageHeader label="Timeline" />
        <Spinner animation="border" variant="primary" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
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
          fetchPlan,
        }}
      >
        <MainPageHeader
          label="Timeline"
          render={(props) => <Toolbar {...props} />}
        />
        {toolbarOptions.viewType === "graph" ? (
          <IncomeGraph />
        ) : (
          <IncomeTable />
        )}
      </DashboardContext.Provider>
      {fetchingStatus.isFetching && <LoadingOverlay roundBottom={true} />}
    </>
  );
}

export default withMainRoute(Dashboard);
