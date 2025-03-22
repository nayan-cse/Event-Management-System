"use client";
import AuthForm from "../components/AuthForm";

const Register = () => {
  return (
    <AuthForm
      title="Register"
      fields={[
        { name: "name", type: "text", placeholder: "Name" },
        { name: "email", type: "email", placeholder: "Email" },
        { name: "password", type: "password", placeholder: "Password" },
      ]}
      buttonText="Register"
      linkText="Already have an account? Login"
      linkHref="/login"
      apiEndpoint="/api/v1/auth/register"
      successRedirect="/login"
    />
  );
};

export default Register;
