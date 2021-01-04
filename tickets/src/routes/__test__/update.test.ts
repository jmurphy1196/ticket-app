import request from "supertest";
import app from "../../app";

const createTicket = () => {
  return request(app).post("/api/tickets").set("Cookie", global.signup()).send({
    title: "lksdfjlksd",
    price: 34,
  });
};

it("returns a 404 if provided ID does not exist", async () => {
  const id = global.createMongoId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signup())
    .send({
      title: "a new title",
      price: 34,
    })
    .expect(404);
});

it("returns a 401 if user is not authenticated", async () => {
  const id = global.createMongoId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "a new title",
      price: 34,
    })
    .expect(401);
});

it("returns a 401 if user is not the creator of the ticket", async () => {
  const ticket = await createTicket();

  const ticketId = ticket.body.id;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", global.signup())
    .send({
      title: "a new title",
      price: 34,
    })
    .expect(401);
});

it("returns a 400 if the ticket details are invalid", async () => {
  const ticket = await createTicket();
  const userId = ticket.body.userId;
  const ticketId = ticket.body.id;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", global.signup(userId))
    .send({
      title: "",
      price: 0,
    })
    .expect(400);
});

it("returns a  if the user updates the ticket", async () => {
  const ticket = await createTicket();
  const userId = ticket.body.userId;
  const ticketId = ticket.body.id;

  const response = await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", global.signup(userId))
    .send({
      title: "a new title",
      price: 34,
    })
    .expect(200);

  expect(response.body.title).toEqual("a new title");
  expect(response.body.price).toEqual(34);
});
