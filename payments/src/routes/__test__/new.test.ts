import { OrderStatus } from "@tkmaster/common";
import request from "supertest";

import app from "../../app";
import Order from "../../model/order";
import stripe from "../../stripe";

it("an order that does not exist will return a 404", async () => {
  const response = await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup())
    .send({ orderId: global.createMongoId(), token: "klsdjf" });

  expect(response.status).toEqual(404);
});

it("returns a 401 when purchasing an order that does not belong to user", async () => {
  const orderId = global.createMongoId();
  const order = Order.build({
    id: orderId,
    price: 34,
    status: OrderStatus.Created,
    userId: global.createMongoId(),
    version: 0,
  });
  await order.save();

  const response = await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup())
    .send({ orderId: orderId, token: "dlskfjlkssdkjf" });

  expect(response.status).toEqual(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = global.createMongoId();
  const cookie = global.signup(userId);
  const orderId = global.createMongoId();
  const order = Order.build({
    id: orderId,
    price: 34,
    status: OrderStatus.Cancelled,
    userId: userId,
    version: 0,
  });
  await order.save();

  const response = await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({ orderId: orderId, token: "skdljf" });

  expect(response.status).toEqual(400);
  expect(order.status).toEqual(OrderStatus.Cancelled);
});

it("request passes if the user is the user that created the order", async () => {
  const userId = global.createMongoId();
  const cookie = global.signup(userId);

  const orderId = global.createMongoId();
  const order = Order.build({
    id: orderId,
    price: 34,
    status: OrderStatus.Created,
    userId: userId,
    version: 0,
  });
  await order.save();

  const response = await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({ orderId: orderId, token: "tok_visa" });

  expect(response.status).toEqual(201);
  console.log(response.body);
});

it("returns a 204 with valid inputs", async () => {
  const userId = global.createMongoId();
  const cookie = global.signup(userId);
  const price = Math.floor(Math.random() * 100) + 1;
  const orderId = global.createMongoId();
  const order = Order.build({
    id: orderId,
    price: price,
    status: OrderStatus.Created,
    userId: userId,
    version: 0,
  });
  await order.save();
  const response = await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({ orderId: orderId, token: "tok_visa" });
  expect(response.status).toEqual(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge?.amount).toEqual(price * 100);
});
