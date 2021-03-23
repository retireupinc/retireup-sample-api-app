import { useContext } from "react";
import { Alert } from "react-bootstrap";
import styled from "styled-components";
import { authContext } from "../contexts/AuthContext";
import withGuestRoute from "../components/WithGuestRoute";
import withPrivateRoute from "../components/WithPrivateRoute";

const StyledMainContainer = styled.div`
  width: 100%;
  padding: 15px;
  margin: auto;
`;

function NotFoundContent(props) {
  const { auth } = useContext(authContext);
  return (
    <StyledMainContainer>
      <Alert variant="danger">
        <Alert.Heading>Oh snap!</Alert.Heading>
        <p>You got an error! The page was not found.</p>
        {!auth?.isAuthenticated ? (
          <Alert.Link href="/login">Click here to login</Alert.Link>
        ) : (
          <Alert.Link href="/">Click here to return</Alert.Link>
        )}
      </Alert>
    </StyledMainContainer>
  );
}

const GuestNotFound = withGuestRoute(NotFoundContent);
const PrivateNotFound = withPrivateRoute(NotFoundContent);

function NotFound(props) {
  const { auth } = useContext(authContext);
  if (!auth?.isAuthenticated) {
    return <GuestNotFound />;
  }

  return <PrivateNotFound />;
}

export default NotFound;
