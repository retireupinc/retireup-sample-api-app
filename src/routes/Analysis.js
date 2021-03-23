import withMainRoute from "../components/WithMainRoute";
import MainPageHeader from "../components/MainPageHeader";

function Analysis() {
  return (
    <>
      <MainPageHeader label="Analysis" />
      <div>Analysis</div>
    </>
  );
}

export default withMainRoute(Analysis);
