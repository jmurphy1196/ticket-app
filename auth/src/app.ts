import express from "express";
import { json } from "body-parser";
import morgan from "morgan";
import cookieSession from "cookie-session";
import "express-async-errors";
import { errorHandler } from "@tkmaster/common";
import {
  currentUserRouter,
  signinRouter,
  signoutRouter,
  signupRouter,
} from "./routes/index";
import { config } from "dotenv";
import { NotFoundError } from "@tkmaster/common";
config();
const app = express();

app.set("trust proxy", true);
app.use(morgan("combined"));
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("*", async () => {
  const err = new NotFoundError();
  throw err;
});

app.use(errorHandler);

export default app;
