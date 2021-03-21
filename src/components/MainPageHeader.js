function MainPageHeader(props) {
  const { label, render } = props;
  return (
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-5 border-bottom">
      <h1 className="h2">{label}</h1>
      {render ? render(props) : null}
    </div>
  );
}

export default MainPageHeader;
