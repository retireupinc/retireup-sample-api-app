import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Form, FormGroup, Input, Label } from "reactstrap";
import styled from "styled-components";
import logo from "../assets/IcLogo.png";
import { authContext } from "../contexts/AuthContext";
import useDidUpdateEffect from "../hooks/useDidUpdateEffect";
import useFetch from "../hooks/useFetch";
import { getNewUserAuth } from "../utils/ApiClient";

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2rem;
`;

const StyledFormContainer = styled.div`
  .form-signin {
    max-width: 400px;
    padding: 15px;
  }

  .form-signin .form-floating:focus-within {
    z-index: 2;
  }

  .form-signin input[name="name"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form-signin input[name="email"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

function Login() {
  const { setAuthStatus } = useContext(authContext);
  const location = useLocation();
  const navigate = useNavigate();

  let from = location.state?.from?.pathname || "/";

  const {
    control,
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
      navigate(from, { replace: true });
    }
  }, [from, navigate, authData, setAuthStatus]);

  return (
    <StyledContainer>
      <StyledFormContainer>
        <Form onSubmit={handleSubmit(setFormData)} className={"form-signin"}>
          <div className="text-center mb-2">
            <img src={logo} alt="InvestCloud" className="mb-4" height="70" />
          </div>
          <Alert color="info">
            Please enter your name and email address. Just about any value will
            do it!!! This information will only be used to save and retrieve the
            clients and plans you create.
          </Alert>
          {authError && (
            <Alert color="danger" className="mt-4">
              Login Failed. Please try again.
            </Alert>
          )}
          <FormGroup floating cssModule={{ "mb-3": "mb-0" }}>
            <Controller
              type="text"
              name="name"
              control={control}
              rules={{
                required: "Enter your name",
                maxLength: 20,
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="loginFormName"
                  placeholder="Name"
                  bsSize="lg"
                  invalid={!!errors.name}
                />
              )}
            />
            <Label htmlFor="loginFormName">Name</Label>
          </FormGroup>
          <FormGroup floating>
            <Controller
              type="text"
              name="email"
              control={control}
              rules={{
                required: "Enter your e-mail",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Enter a valid e-mail address",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="loginFormEmail"
                  placeholder="Email address"
                  bsSize="lg"
                  invalid={!!errors.email}
                />
              )}
            />
            <Label htmlFor="loginFormEmail">Email address</Label>
          </FormGroup>
          <Button
            type="submit"
            color="primary"
            block
            size="lg"
            disabled={isPending}
          >
            Start
          </Button>
        </Form>
      </StyledFormContainer>
    </StyledContainer>
  );
}

export default Login;
