"use client";

import AuthForm from "../components/AuthForm";

const ResetPassword = () => {
  return (
    <AuthForm
      title="Reset Password"
      fields={[
        { name: "newPassword", type: "password", placeholder: "New Password" },
      ]}
      buttonText="Reset Password"
      apiEndpoint="/api/v1/auth/reset-password"
      successRedirect="/login"
    />
  );
};

export default ResetPassword;
