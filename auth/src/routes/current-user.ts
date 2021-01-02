import express, { NextFunction, Request, Response } from "express";
import baseRouteName from "../util/route-config";
import jwt from "jsonwebtoken";

const router = express.Router();

const baseUserUrl = baseRouteName.baseUserUrl;

router.get(
  `${baseUserUrl}/currentuser`,
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.jwt) {
      return res.send({ currentUser: null });
    }
    try {
      const token = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
      res.send({ currentUser: token });
    } catch (err) {
      res.send({ currentUser: null });
    }
  }
);

export { router as currentUserRouter };
