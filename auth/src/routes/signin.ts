import express, { NextFunction, Request, Response } from "express";
import baseRouteName from "../util/route-config";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import User from "../models/user";
import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../errors/bad-request-error";
import jwt from "jsonwebtoken";
import Password from "../util/password";
const router = express.Router();

const baseUserUrl = baseRouteName.baseUserUrl;

router.post(
  `${baseUserUrl}/signin`,
  [
    body("email").isEmail().withMessage("must be a valid email"),
    body("password").trim().notEmpty().withMessage("must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("invalid credentials");
    }
    const validPassword = await Password.compare(
      existingUser.password,
      password
    );
    if (!validPassword) {
      throw new BadRequestError("invalid credentials");
    }
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
