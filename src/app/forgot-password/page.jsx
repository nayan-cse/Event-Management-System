"use client";
import AuthForm from "../components/AuthForm";

const ForgotPassword = () => {
  return (
    <AuthForm
      title="Forgot Password"
      fields={[{ name: "email", type: "email", placeholder: "Email" }]}
      buttonText="Send Reset Link"
      linkText="Back to Login"
      linkHref="/login"
      apiEndpoint="/api/v1/auth/forgot-password"
      successRedirect="/login"
    />
  );
};

export default ForgotPassword;
