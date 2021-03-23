import withPrivateRoute from "../components/WithPrivateRoute";
import MainPageHeader from "../components/MainPageHeader";

function Investments() {
  return (
    <>
      <MainPageHeader label="Investments" />
      <div>Investments</div>
    </>
  );
}

export default withPrivateRoute(Investments);
