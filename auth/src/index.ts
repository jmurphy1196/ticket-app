import express from "express";
import { json } from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieSession from "cookie-session";
import "express-async-errors";
import { errorHandler } from "./middlewares/error-handler";
import {
  currentUserRouter,
  signinRouter,
  signoutRouter,
  signupRouter,
} from "./routes/index";
import { config } from "dotenv";
import { NotFoundError } from "./errors/not-found-error";
import app from "./app";
config();

(async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY is undefined");
  try {
    await mongoose.connect("mongodb://auth-mongo-serv:27017", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log("connected to mongodb! :D");
  } catch (err) {
    throw err;
  }

  app.listen(3000, () => {
    console.log("server is lisening on port 3000!!!");
  });
})();
