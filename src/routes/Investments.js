import withMainRoute from "../components/WithMainRoute";
import MainPageHeader from "../components/MainPageHeader";

function Investments() {
  return (
    <>
      <MainPageHeader label="Investments" />
      <div>Investments</div>
    </>
  );
}

export default withMainRoute(Investments);
