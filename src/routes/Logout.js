import { useContext, useEffect } from "react";
import { Alert } from "reactstrap";
import styled from "styled-components";
import { authContext } from "../contexts/AuthContext";

const StyledMainContainer = styled.div`
  width: 100%;
  padding: 15px;
  margin: auto;
`;

function Logout() {
  const { setUnauthStatus } = useContext(authContext);
  useEffect(() => {
    setTimeout(() => {
      setUnauthStatus();
    }, 250);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledMainContainer>
      <Alert color="danger">
        <h4 className="alert-heading">Bye Bye!</h4>
        <p>Logging out.</p>
        <hr />
        <p className="mb-0">
          <a className="alert-link" href="/login">
            Click here to logout
          </a>
        </p>
      </Alert>
    </StyledMainContainer>
  );
}

export default Logout;
