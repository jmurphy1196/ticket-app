import express, { NextFunction, Request, Response } from "express";
import baseRouteName from "../util/route-config";

const router = express.Router();

const baseUserUrl = baseRouteName.baseUserUrl;

router.get(
  `${baseUserUrl}/currentuser`,
  (req: Request, res: Response, next: NextFunction) => {
    res.send({ user: "jimbo!" });
  }
);

export { router as currentUserRouter };
