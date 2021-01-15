import { useState, useEffect } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import Button from "../../components/buttons/main-btn";
import AuthForm from "../../components/auth-form";
const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fields = ["email", "password"];

  return (
    <>
      <AuthForm heading='signin' route='signin' fields={fields} />
    </>
  );
};

export default Signin;
