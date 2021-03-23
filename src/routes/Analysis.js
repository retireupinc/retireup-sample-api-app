import withMainLayout from "../components/WithMainLayout";
import MainPageHeader from "../components/MainPageHeader";

function Analysis() {
  return (
    <>
      <MainPageHeader label="Analysis" />
      <div>Analysis</div>
    </>
  );
}

export default withMainLayout(Analysis);
