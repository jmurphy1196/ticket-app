import express, { Request, Response, NextFunction, response } from "express";
import {
  BadRequestError,
  currentUser,
  requireAuth,
  validateRequest,
} from "@tkmaster/common";
import { body } from "express-validator";
import Ticket from "../models/ticket";
import TicketCreatedPublisher from "../events/publishers/ticket-created-publisher";
import natsWrapper from "../nats-wrapper";
import AWS from "aws-sdk";
const router = express.Router();

const getPhotoDetails = (photo: any) => {
  let photodetails = photo.name.split(".");
  let photoExt = photodetails[photodetails.length - 1];
  let photoName = photodetails.slice(0, photodetails.length - 1).join("");
  console.log(photo);
  let photoMimetype = photo.mimetype;

  return { photoExt, photoName, photoMimetype };
};

const s3Bucket = new AWS.S3({
  credentials: {
    secretAccessKey: process.env.AWS_KEY!,
    accessKeyId: process.env.AWS_KEY_ID!,
  },
  region: "us-west-1",
});

router.post(
  "/api/tickets",
  currentUser,
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("price must be greater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;
    const { photo } = req.files!;
    if (!photo) throw new BadRequestError("invalid image");

    const { photoExt, photoName, photoMimetype } = getPhotoDetails(photo);
    if (photoMimetype !== "image/jpeg" && photoMimetype !== "image/png") {
      throw new BadRequestError("invalid photo format");
    }
    const photoUrl = `${new Date().toISOString()}.${photoName}.${photoExt}`;
    const params = {
      Key: photoUrl,
      //@ts-ignore
      Body: photo.data,
      Bucket: "watchparty-storage",
      ACL: "public-read",
    };
    console.log("THESE ARE THE PARAMS");
    console.log(params);
    s3Bucket.upload(params, (err: any) => {
      console.log(err);

      console.log("this ran");
    });
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
      imageUrl: photoUrl,
    });

    await ticket.save();

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      imageUrl: photoUrl,
    });
    return res.status(201).send(ticket);
  }
);

router.post(
  "/api/tickets/:ticketId",
  currentUser,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { photo } = req.files!;
    //@ts-ignore
    let photoExt = photo.name.split(".");
    photoExt = photoExt[photoExt.length - 1];
    console.log("this ran");
    console.log("FILE INFO");
    console.log(photoExt);
    res.status(201).send({ message: "OK!" });
  }
);

export { router as createTicketRouter };
