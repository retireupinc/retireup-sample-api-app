import { useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import useFetch from "../../hooks/useFetch";
import { fetchPlanByTagName } from "../../utils/ApiClient";
import withPrivateRoute from "../../components/WithPrivateRoute";
import MainPageHeader from "../../components/MainPageHeader";
import { LoadingOverlay } from "../../components/Styled";
import DashboardContext from "./DashboardContext";
import IncomeGraph from "./IncomeGraph";
import IncomeTable from "./IncomeTable";
import Toolbar from "./Toolbar";

const defaultToolbarOptions = {
  example: "BOOMER_W_CASH",
  viewType: "graph",
  yearType: "allYears",
};

function Dashboard(props) {
  const [toolbarOptions, setToolbarOptions] = useState({
    ...defaultToolbarOptions,
    defaults: { ...defaultToolbarOptions },
  });

  const { example, viewType } = toolbarOptions;

  // Gets called on first render or when the "example" option changes
  const [householdData, householdError, isPending] = useFetch(
    () => fetchPlanByTagName(example),
    true,
    [example]
  );

  const { household, plan } = householdData || {};
  if (!household || !plan || !plan?.outcome) {
    return (
      <>
        {householdError && (
          <Alert variant="danger" className="mt-4">
            <Alert.Heading>Oh snap!</Alert.Heading>
            <p>{householdError.error_description}</p>
          </Alert>
        )}
        <MainPageHeader label="Timeline" />
        {isPending && (
          <Spinner animation="border" variant="primary" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
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
          setToolbarOptions,
        }}
      >
        {householdError && (
          <Alert variant="danger" className="mt-4">
            <Alert.Heading>Oh snap!</Alert.Heading>
            <p>{householdError.error_description}</p>
          </Alert>
        )}
        <MainPageHeader
          label="Timeline"
          render={(props) => <Toolbar {...props} />}
        />
        {viewType === "graph" ? <IncomeGraph /> : <IncomeTable />}
      </DashboardContext.Provider>
      {isPending && <LoadingOverlay roundBottom={true} />}
    </>
  );
}

export default withPrivateRoute(Dashboard);
