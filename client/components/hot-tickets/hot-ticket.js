import useRequest from "../../hooks/use-request";
import Router from "next//router";
import Button from "../buttons/main-btn";
import serializeTicketUrl from "../../util/serialize-ticket-image-url";

const HotTicket = ({ title, price, id, imageUrl }) => {
  if (!title) title = "CONCERT";
  if (!price) price = 49;
  imageUrl = serializeTicketUrl(imageUrl);

  const { doRequest, errors, originalErrors } = useRequest({
    body: {
      ticketId: id,
    },
    method: "POST",
    url: "/api/orders",
    onSuccess: (order) => {
      Router.push("/orders/[orderId]", `/orders/${order.id}`);
    },
  });

  let btnMessage =
    originalErrors[0] && originalErrors[0] === "ticket is already ordered"
      ? "unavailable"
      : "buy now";
  if (originalErrors[0] && originalErrors[0].message === "not authorized")
    Router.push("/auth/signin");

  return (
    <div class='card'>
      <div class='card__side card__side--front'>
        <div class='card__picture card__picture--1'>
          <img className='card__picture__img' src={imageUrl} alt={title} />
        </div>
        <h4 class='card__heading'>
          <span class='card__heading-span card__heading-span--1'>
            {title} ONLY ${price}
          </span>
        </h4>
        <div class='card__details'>
          <ul>
            <li>{title}</li>
            <li>${price}</li>
          </ul>
        </div>
      </div>
      <div class='card__side card__side--back card__side--back-1'>
        <div class='card__cta'>
          <div class='card__price-box'>
            <p class='card__price-only'>ONLY</p>
            <p class='card__price-value'>${price}</p>
          </div>
          <Button onClick={doRequest}>{btnMessage}</Button>
        </div>
      </div>
    </div>
  );
};

export default HotTicket;
