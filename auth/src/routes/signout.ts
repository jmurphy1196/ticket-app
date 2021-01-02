import express, { NextFunction, Request, Response } from "express";
import baseRouteName from "../util/route-config";
const router = express.Router();

const baseUserUrl = baseRouteName.baseUserUrl;

router.post(
  `${baseUserUrl}/signout`,
  (req: Request, res: Response, next: NextFunction) => {
    req.session = null;
    return res.status(200).send({});
  }
);

export { router as signoutRouter };
