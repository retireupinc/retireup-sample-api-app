import withPrivateRoute from "../components/WithPrivateRoute";
import MainPageHeader from "../components/MainPageHeader";

function Analysis() {
  return (
    <>
      <MainPageHeader label="Analysis" />
      <div>Analysis</div>
    </>
  );
}

export default withPrivateRoute(Analysis);
