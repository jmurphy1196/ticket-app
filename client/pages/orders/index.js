import Navbar from "../../components/navbar";
import Link from "next/link";

const OrderIndex = ({ currentUser, orders, ordersByStatus }) => {
  return (
    <>
      <Navbar currentUser={currentUser} />
      <section className='orders'>
        <h1 id='orders-header' className='heading-primary text-center'>
          <span className='heading-primary--main'>Orders</span>
          <span className='heading-primary--sub'>My Account</span>
        </h1>
        <ul className='orders__list'>
          {ordersByStatus.created.map((order) => {
            return (
              <Link href={`/orders/${order.id}`}>
                <a
                  style={{ color: "inherit", textDecoration: "none" }}
                  href='#a'
                >
                  <li className={`${order.status}`} key={order.id}>
                    {order.ticket.title} - {order.status}
                  </li>
                </a>
              </Link>
            );
          })}
          {ordersByStatus.cancelled.map((order) => {
            return (
              <Link href={`/orders/${order.id}`}>
                <a style={{ textDecoration: "none" }} href='#a'>
                  <li className={`${order.status}`} key={order.id}>
                    {order.ticket.title} - {order.status}
                  </li>
                </a>
              </Link>
            );
          })}
        </ul>
      </section>
    </>
  );
};

OrderIndex.getInitialProps = async (ctx, client, currentUser) => {
  const { data } = await client.get("/api/orders");

  const ordersByStatus = {
    created: [],
    expired: [],
    completed: [],
    cancelled: [],
  };

  for (let order of data) {
    switch (order.status) {
      case "created":
        ordersByStatus.created.push(order);
        break;
      case "cancelled":
        ordersByStatus.cancelled.push(order);
        break;
    }
  }

  return { orders: data, ordersByStatus };
};

export default OrderIndex;
