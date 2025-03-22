"use client";

import AuthForm from "../components/AuthForm";

const Login = () => {
  return (
    <AuthForm
      title="Login"
      fields={[
        { name: "email", type: "email", placeholder: "Email" },
        { name: "password", type: "password", placeholder: "Password" },
      ]}
      buttonText="Login"
      linkText="Don't have an account? Register"
      linkHref="/register"
      apiEndpoint="/api/v1/auth/login"
      successRedirect="/dashboard"
    />
  );
};

export default Login;
