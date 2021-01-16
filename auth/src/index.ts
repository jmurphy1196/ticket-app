import mongoose from "mongoose";
import "express-async-errors";
import { config } from "dotenv";
import app from "./app";
config();

(async () => {

  console.log("...starting up auth service now...");

  if (!process.env.JWT_KEY) throw new Error("JWT_KEY is undefined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is undefined");
  try {
    await mongoose.connect(process.env.MONGO_URI || "", {
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
