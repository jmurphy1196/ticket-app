import Button from "./buttons/main-btn";
import { useState } from "react";
import useRequest from "../hooks/use-request";
import Link from "next/link";
import Router from "next/router";

const AuthForm = ({ heading, fields, route }) => {
  if (!route) route = heading;
  const [formData, setFormData] = useState({});

  const { doRequest, errors, originalErrors } = useRequest({
    url: `/api/users/${route}`,
    method: "POST",
    body: { ...formData },
    onSuccess: () => {
      Router.push("/");
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };
  const subTextMsg =
    heading === "signup"
      ? "Already Have an account? ->  signin here."
      : "Need an account? -> Signup here.";
  const subText = (
    <div className='auth__form__sub-text text-center mb-2'>
      <Link href={`/auth/${heading === "signup" ? "signin" : "signup"}`}>
        <a href='#a' style={{ textDecoration: "none", color: "inherit" }}>
          {" "}
          <h3 className='heading-tertiary'>{subTextMsg}</h3>{" "}
        </a>
      </Link>
    </div>
  );
  return (
    <>
      <div className='auth__background'>
        <div className='auth__form'>
          <div class='text-center mb-8'>
            <h2 class='heading-secondary'>
              <span>{heading}</span>
            </h2>
          </div>
          <form onSubmit={(e) => handleSubmit(e)} className='auth__form__form'>
            {fields.map((field, i) => {
              return (
                <div className='auth__form__form__group mb-4' key={i}>
                  <label className='auth__form__label'>
                    {field === "confirmPassword" ? "confirm password" : field}{" "}
                    <span>
                      {" "}
                      {originalErrors[field] && `${originalErrors[field]}`}{" "}
                    </span>
                  </label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    type={
                      field.toLowerCase() === "password" ? "password" : "text"
                    }
                    className='auth__form__input'
                  />
                </div>
              );
            })}
            {subText}
            <div style={{ margin: "0 auto" }} className='text-center-mt-8'>
              <Button color='blue' animated onClick={(e) => handleSubmit(e)}>
                {heading}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
