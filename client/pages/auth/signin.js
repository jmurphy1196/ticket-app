import { useState, useEffect } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
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
      <h1>Sign In</h1>
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
        Signin
      </button>
    </form>
  );
};

export default Signin;
