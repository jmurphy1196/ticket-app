import request from "supertest";
import app from "../../app";

it("invalid password returns a 400", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "jmm12355",
      confirmPassword: "jmm12355",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "klsdjflksdjfkl",
    })
    .expect(400);
});

it("user not found returns a 400", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "apples@apples.com",
      password: "klsdajfdksjf",
    })
    .expect(400);
});

it("valid login returns a 200", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@testing.com",
      password: "jmm12355",
      confirmPassword: "jmm12355",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@testing.com",
      password: "jmm12355",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
