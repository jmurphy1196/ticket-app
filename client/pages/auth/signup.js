import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import styles from "../main.module.scss";
import AuthForm from "../../components/auth-form";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fields = ["email", "password", "confirmPassword"];

  return (
    <>
      <AuthForm heading='signup' route='signup' fields={fields} />
    </>
  );
};
