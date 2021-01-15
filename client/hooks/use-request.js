import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const [originalErrors, setOriginalErrors] = useState({});
  method = method.toLowerCase();

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      if (props.page) {
        url += `${props.page}`;
      }
      let response;
      console.log("THIS IS THE BODY", body);
      if (!props.formData) {
        console.log("this ran");
        const newBody = { ...body };
        if (props.token) newBody.token = props.token;
        response = await axios[method](url, newBody);
      } else {
        response = await axios[method](url, props.formData);
      }
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      console.log(err);
      console.log("this is thhe ERROR");
      const ogErrors = {};
      err.response.data.errors.forEach((error, i) => {
        if (error.field) {
          ogErrors[error.field] = error.message;
        } else {
          ogErrors[i] = error.message;
        }
      });

      setOriginalErrors(ogErrors);
      console.log("original erro", ogErrors);
      setErrors(
        <div className='alert alert-danger'>
          <h4>Oops!...</h4>
          <ul className='my-0'>
            {err.response.data.errors.map((err) => {
              return <li key={err.message}>{err.message}</li>;
            })}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors, originalErrors };
};
