import { useContext } from "react";
import { Alert } from "react-bootstrap";
import { authContext } from "../contexts/AuthContext";
import withGuestRoute from "../components/WithGuestRoute";
import withMainRoute from "../components/WithMainRoute";

function ErrorMessage() {
  return (
    <Alert variant="danger">
      <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
      <p>Looks like the page is not valid.</p>
    </Alert>
  );
}

const GuestRouteError = withGuestRoute(ErrorMessage);
const MainRouteError = withMainRoute(ErrorMessage);

function Error(props) {
  const { auth } = useContext(authContext);
  if (!auth?.isAuthenticated) {
    return <GuestRouteError />;
  }

  return <MainRouteError />;
}

export default Error;
