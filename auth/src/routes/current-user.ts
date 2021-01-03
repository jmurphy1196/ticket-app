import express, { NextFunction, Request, Response } from "express";
import baseRouteName from "../util/route-config";
import { currentUser } from "@tkmaster/common";

const router = express.Router();

const baseUserUrl = baseRouteName.baseUserUrl;

router.get(
  `${baseUserUrl}/currentuser`,
  currentUser,
  (req: Request, res: Response, next: NextFunction) => {
    if (req.currentUser) {
      return res.send({ currentUser: { ...req.currentUser } });
    } else {
      res.send({ currentUser: null });
    }
  }
);

export { router as currentUserRouter };
