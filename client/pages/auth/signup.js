import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "POST",
    body: { email, password },
    onSuccess: () => {
      Router.push("/");
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <div className='form-group'>
        <label>Email Address</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          className='form-control'
          type='text'
        />
      </div>
      <div className='form-group'>
        <label>Password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          className='form-control'
          type='password'
        />
      </div>
      {errors}
      <button type='submit' className='btn btn-primary'>
        Sign Up
      </button>
    </form>
  );
};
