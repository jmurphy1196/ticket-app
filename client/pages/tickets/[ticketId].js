import useRequest from "../../hooks/use-request";
import { useState } from "react";
import Router from "next/router";
import HotTicket from "../../components/hot-tickets/hot-ticket";
import Navbar from "../../components/navbar";

const TicketShow = ({ currentUser, ticket }) => {
  const { doRequest, errors, originalErrors } = useRequest({
    body: {
      ticketId: ticket.id,
    },
    method: "POST",
    url: "/api/orders",
    onSuccess: (order) => {
      Router.push("/orders/[orderId]", `/orders/${order.id}`);
    },
  });
  const [pageErrors, setPageErrors] = useState([]);
  if (originalErrors) console.log(originalErrors);
  return (
    <>
      <Navbar currentUser={currentUser} />
      <div
        className='card-outer-container'
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className='card-container'
          style={{
            width: "40rem",
          }}
        >
          <HotTicket
            imageUrl={ticket.imageUrl}
            title={ticket.title}
            price={ticket.price}
            id={ticket.id}
          />
        </div>
      </div>
    </>
  );
};

TicketShow.getInitialProps = async (ctx, client, currentUser) => {
  const { ticketId } = ctx.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};
export default TicketShow;

/*


    <div>
      {errors}
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      <button onClick={() => doRequest()} className='btn btn-primary'>
        Purchase
      </button>
    </div>
**/
