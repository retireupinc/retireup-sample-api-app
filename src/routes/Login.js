import { useContext, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { getNewUserAuth } from "../utils/ApiClient";
import useFetch from "../hooks/useFetch";
import useDidUpdateEffect from "../hooks/useDidUpdateEffect";
import { authContext } from "../contexts/AuthContext";
import withGuestRoute from "../components/WithGuestRoute";
import { ReactComponent as Logo } from "../assets/logo_t118_RU_160x32_black.svg";

const StyledForm = styled.form`
  width: 100%;
  max-width: 420px;
  padding: 15px;
  margin: auto;

  .form-control {
    position: relative;
    box-sizing: border-box;
    height: auto;
    padding: 10px;
    font-size: 16px;
  }
  input[type="text"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  input[type="email"] {
    margin-bottom: 20px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

function Login() {
  const { setAuthStatus } = useContext(authContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [formData, setFormData] = useState();

  // Gets called when the form gets submitted
  const [authData, authError, isPending] = useFetch(
    () => getNewUserAuth(formData),
    [formData]
  );

  // Gets called after the auth request is done
  useDidUpdateEffect(() => {
    if (authData) {
      setAuthStatus(authData);
    }
  }, [authData, setAuthStatus]);

  return (
    <Form as={StyledForm} onSubmit={handleSubmit(setFormData)}>
      <div className="text-center mb-4">
        <Logo className="mb-4" width="320" height="64" />
      </div>
      {authError && (
        <Alert variant="danger" className="mt-4">
          Login Failed. Please try again.
        </Alert>
      )}
      <Form.Label srOnly htmlFor="loginFormName">
        Name
      </Form.Label>
      <Form.Control
        id="loginFormName"
        type="text"
        name="name"
        placeholder="Enter name"
        size="lg"
        ref={register({ required: "Enter your name", maxLength: 20 })}
        isInvalid={!!errors.name}
      />
      <Form.Label srOnly htmlFor="loginFormEmail">
        Email address
      </Form.Label>
      <Form.Control
        id="loginFormEmail"
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
      <Button
        type="submit"
        variant="primary"
        block
        size="lg"
        disabled={isPending}
      >
        Sign in
      </Button>
    </Form>
  );
}

export default withGuestRoute(Login);
