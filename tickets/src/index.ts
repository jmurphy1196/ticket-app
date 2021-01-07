import mongoose from "mongoose";
import "express-async-errors";
import { config } from "dotenv";
import app from "./app";
import natsWrapper from "./nats-wrapper";
import { randomBytes } from "crypto";
import OrderCreatedListener from "./events/listeners/order-created-listener";
import OrderCancelledListener from "./events/listeners/order-cancelled-listener";
config();

(async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY is undefined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is undefined");
  if (!process.env.NATS_CLIENT_ID)
    throw new Error("NATS_CLIENT_ID is undefined");
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error("NATS_CLUSTER_ID is undefined");
  if (!process.env.NATS_URL) throw new Error("NATS_URL is undefined");
  try {
    const natsId = randomBytes(4).toString("hex");
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS CONNECTION WAS CLOSED");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCancelledListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();
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
    console.log("tickets server is lisening on port 3000!!!");
  });
})();
