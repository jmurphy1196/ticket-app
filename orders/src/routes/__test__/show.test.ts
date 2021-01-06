import request from "supertest";
import app from "../../app";

it("fetches an order if it was created by the user", async () => {
  const cookie = global.signup();
  const ticketId = await global.createTicket();
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticketId })
    .expect(201);

  const userOrder = await request(app)
    .get(`/api/orders/${response.body.id}`)
    .set("Cookie", cookie)
    .expect(200);
  expect(userOrder.body.ticket.id).toEqual(ticketId);
});

it("a user cannot search onother users order", async () => {
  const ticketId = await global.createTicket();
  const order1 = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticketId });

  const getOrder = await request(app)
    .get(`/api/orders/${order1.body.id}`)
    .set("Cookie", global.signup())
    .expect(401);
});
