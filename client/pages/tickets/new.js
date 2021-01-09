import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    body: {
      title: title,
      price: price,
    },
    url: "/api/tickets",
    method: "POST",
    onSuccess: (ticket) => Router.push("/"),
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };
  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) return;

    setPrice(value.toFixed(2));
  };
  return (
    <div>
      <h1>Create a Ticket</h1>
      {errors}
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className='form-control'
          />
        </div>
        <button className='btn btn-primary' type='submit'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewTicket;
