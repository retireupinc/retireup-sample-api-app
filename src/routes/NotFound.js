import { useContext } from "react";
import { Alert } from "reactstrap";
import styled from "styled-components";
import { authContext } from "../contexts/AuthContext";

const StyledMainContainer = styled.div`
  width: 100%;
  padding: 15px;
  margin: auto;
`;

function NotFound(props) {
  const { auth } = useContext(authContext);
  return (
    <StyledMainContainer>
      <Alert color="danger">
        <h4 className="alert-heading">Oh snap!</h4>
        <p>You got an error! The page was not found.</p>
        <hr />
        <p className="mb-0">
          {!auth?.isAuthenticated ? (
            <a className="alert-link" href="/login">
              Click here to login
            </a>
          ) : (
            <a className="alert-link" href="/">
              Click here to return
            </a>
          )}
        </p>
      </Alert>
    </StyledMainContainer>
  );
}

export default NotFound;
