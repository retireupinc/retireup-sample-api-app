import { useContext, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { authContext } from "../contexts/AuthContext";
import withMainRoute from "../components/WithMainRoute";

function Logout() {
  const { setUnauthStatus } = useContext(authContext);
  useEffect(() => {
    setTimeout(() => {
      setUnauthStatus();
    }, 1000);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
      <Spinner animation="border" variant="primary" role="status">
        <span className="sr-only">Please wait...</span>
      </Spinner>
    </div>
  );
}

export default withMainRoute(Logout);
