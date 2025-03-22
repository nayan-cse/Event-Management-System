"use client";
import React from "react";
import AuthForm from "../components/AuthForm";
import { useSearchParams } from "next/navigation";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Extract token from URL

  return (
    <AuthForm
      title="Reset Password"
      fields={[
        { name: "newPassword", type: "password", placeholder: "New Password" },
      ]}
      buttonText="Reset Password"
      apiEndpoint="/api/v1/auth/reset-password"
      successRedirect="/login"
      additionalData={{ token }} // Pass the token as additional data
    />
  );
};

export default ResetPassword;
