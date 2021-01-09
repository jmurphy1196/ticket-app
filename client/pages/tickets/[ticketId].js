import useRequest from "../../hooks/use-request";
import Router from "next/router";

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    body: {
      ticketId: ticket.id,
    },
    method: "POST",
    url: "/api/orders",
    onSuccess: (order) => {
      Router.push("/orders/[orderId]", `/orders/${order.id}`);
    },
  });
  return (
    <div>
      {errors}
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      <button onClick={() => doRequest()} className='btn btn-primary'>
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (ctx, client, currentUser) => {
  const { ticketId } = ctx.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};
export default TicketShow;
