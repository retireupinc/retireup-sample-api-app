import { useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { getNewUserAuth } from "../utils/ApiClient";
import { authContext } from "../contexts/AuthContext";
import withGuestRoute from "../components/WithGuestRoute";
import { ReactComponent as Logo } from "../assets/logo_t118_RU_160x32_black.svg";

const StyledForm = styled.form`
  width: 100%;
  max-width: 420px;
  padding: 15px;
  margin: auto;
`;

function Login() {
  const { setAuthStatus } = useContext(authContext);
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => {
    getNewUserAuth(data).then((auth) => {
      setAuthStatus(auth);
    });
  };
  return (
    <Form as={StyledForm} onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center mb-4">
        <Logo className="mb-4" width="320" height="64" />
      </div>
      <Form.Group controlId="loginFormName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          placeholder="Enter name"
          size="lg"
          ref={register({ required: "Enter your name", maxLength: 20 })}
          isInvalid={!!errors.name}
        />
        {errors.name && (
          <Form.Control.Feedback type="invalid">
            {errors.name.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Form.Group controlId="loginFormEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          name="email"
          placeholder="Enter email"
          size="lg"
          ref={register({
            required: "Enter your e-mail",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Enter a valid e-mail address",
            },
          })}
          isInvalid={!!errors.email}
        />
        {errors.email && (
          <Form.Control.Feedback type="invalid">
            {errors.email.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Button type="submit" variant="primary" block size="lg">
        Sign in
      </Button>
    </Form>
  );
}

export default withGuestRoute(Login);
