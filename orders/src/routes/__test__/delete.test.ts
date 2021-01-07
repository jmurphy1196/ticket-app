import request from "supertest";
import app from "../../app";
import natsWrapper from "../../nats-wrapper";

it("a user can cancel an order they created", async () => {
  const ticketId = await global.createTicket();
  const cookie = global.signup();
  const orderResponse = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticketId })
    .expect(201);

  const cancelOrder = await request(app)
    .delete(`/api/orders/${orderResponse.body.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(204);

  expect(cancelOrder.body._id).toEqual(orderResponse.body._id);
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});

it.todo("emit and event when an order is cancelled");
