import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    body: {
      orderId: order.id,
    },
    method: "POST",
    url: "/api/payments",
    onSuccess: (payment) => {
      Router.push("/orders");
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <br />
      {errors}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_51I7K2nLQef5YAp3FLPhtvRil2HHtICqqjJLflNVcc9pzhQ5T4rEnDJ7pPh733MqV3Ip7x4wwfLT52manvE9771cy00Bh1pPVZl'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  );
};

OrderShow.getInitialProps = async (ctx, client, currentUser) => {
  const { orderId } = ctx.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  console.log("this is the DATA");
  console.log(data);

  return { order: data, currentUser };
};

export default OrderShow;
