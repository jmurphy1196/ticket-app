import request from "supertest";
import app from "../../app";
import natsWrapper from "../../nats-wrapper";

it("should not allow an unauthenticated user to create an order", async () => {
  const response = await request(app)
    .post("/api/orders")
    .send({ ticketId: "sdlkfj" })
    .expect(401);
});

it("will not process order without a ticket id ", async () => {
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: "" })
    .expect(400);
});

it("if a order already exists for this ticketId the order will not be processed", async () => {
  const ticketId = await global.createTicket();
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticketId })
    .expect(201);
  const response_2 = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticketId })
    .expect(400);
});

it("returns a 404 if ticket is not found", async () => {
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: global.createMongoId() })
    .expect(404);
});

it("a user can purchase a ticket if it is not reserved", async () => {
  const ticketId = await global.createTicket();
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticketId })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it.todo("emit an event when an order is issued");
