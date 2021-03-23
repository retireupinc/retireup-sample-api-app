import Header from "./Header";
import SideBar from "./SideBar";

function withMainLayout(WrappedComponent) {
  function WithMainLayout(props) {
    return (
      <>
        <Header />
        <div className="container-fluid">
          <div className="row">
            <SideBar />
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
              <WrappedComponent {...props} />
            </main>
          </div>
        </div>
      </>
    );
  }

  return WithMainLayout;
}

export default withMainLayout;
