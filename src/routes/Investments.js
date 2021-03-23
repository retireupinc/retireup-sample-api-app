import withMainLayout from "../components/WithMainLayout";
import MainPageHeader from "../components/MainPageHeader";

function Investments() {
  return (
    <>
      <MainPageHeader label="Investments" />
      <div>Investments</div>
    </>
  );
}

export default withMainLayout(Investments);
