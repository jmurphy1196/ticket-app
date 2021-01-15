import express from "express";
import { json } from "body-parser";
import morgan from "morgan";
import cookieSession from "cookie-session";
import "express-async-errors";
import fileUpload from "express-fileupload";
import { errorHandler } from "@tkmaster/common";
import { config } from "dotenv";
import { NotFoundError } from "@tkmaster/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";
config();
const app = express();

app.set("trust proxy", true);
app.use(morgan("combined"));
app.use(json());
app.use(fileUpload());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(createTicketRouter);
app.use(updateTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);

app.all("*", async () => {
  const err = new NotFoundError();
  throw err;
});

app.use(errorHandler);

export default app;
