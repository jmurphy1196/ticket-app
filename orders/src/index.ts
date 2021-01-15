import mongoose from "mongoose";
import "express-async-errors";
import { config } from "dotenv";
import app from "./app";
import natsWrapper from "./nats-wrapper";
import { randomBytes } from "crypto";
import checkEnv from "./util/check-env";
import TicketCreatedListener from "./events/listeners/ticket-created-listener";
import TicketUpdatedListener from "./events/listeners/ticket-updated-listener";
import ExpirationCompleteListener from "./events/listeners/expiration-complete-listener";
import PaymentCreatedListener from "./events/listeners/payment-complete-listener";
config();

console.log("im new again");

(async () => {
  //check necessary env variables, if one is not found service will not start and throw a new error
  console.log("starting...");
  checkEnv();
  try {
    const natsId = randomBytes(4).toString("hex");
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS CONNECTION WAS CLOSED");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
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
