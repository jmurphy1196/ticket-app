import request from "supertest";
import app from "../../app";
import Ticket from "../../models/ticket";

it(" /api/tickets post requests", async () => {
  const cookie = global.signup();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "a new title",
      price: 34,
    });
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is logged in", async () => {
  const response = await request(app).post("/api/tickets").send({
    title: "a new title",
    price: 40,
  });
  expect(response.status).toEqual(401);
});

it("can only be accessed if the user is logged in", async () => {
  const cookie = global.signup();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "a new title",
      price: 34,
    });
  expect(response.status).toEqual(201);
});

it("returns an error if an invalid title is provided", async () => {
  const cookie = global.signup();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 14,
    })
    .expect(400);
});

it("returns an error if invalid price is provided", async () => {
  const cookie = global.signup();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "",
      price: -14,
    })
    .expect(400);

  const response_2 = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "",
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  // TODO add in a check to make sure ticket is saved with a code of 201
  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);
  const cookie = global.signup();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "a new title",
      price: 34,
    })
    .expect(201);
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});
