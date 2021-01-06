import request from "supertest";
import app from "../../app";

it("returns a list of orders created by the user", async () => {
  //create 3 tickets
  const ticketId = await global.createTicket();
  const ticketId_1 = await global.createTicket();
  const ticketId_2 = await global.createTicket();
  //create the user cookie for orders
  const cookie = global.signup();
  //issue 3 orders
  const orderResponse = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticketId })
    .expect(201);
  const orderResponse_1 = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticketId_2 })
    .expect(201);
  const orderResponse_2 = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticketId_1 })
    .expect(201);
  //should return 3 orders since this user ordered 3 tickets
  const getOrders = await request(app)
    .get("/api/orders")
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  console.log(getOrders.body);

  expect(getOrders.body.length).toEqual(3);
});
