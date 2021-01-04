import request from "supertest";
import app from "../../app";

it("returns a 404 if token is not found", async () => {
  const id = global.createMongoId();
  await request(app).get(`/api/tickets/${id}`).send({}).expect(404);
});

it("returns a ticket if it is found", async () => {
  const title = "a new title";
  const price = 34;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title,
      price,
    });

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send({})
    .expect(200);
});
