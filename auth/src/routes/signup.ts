import express, { NextFunction, Request, Response } from "express";
import baseRouteName from "../util/route-config";
import { body, ValidationError, validationResult } from "express-validator";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import jwt from "jsonwebtoken";
import { RequestValidationError } from "../errors/request-validation-error";
import User from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import Password from "../util/password";
import { validateRequest } from "../middlewares/validate-request";
const router = express.Router();

const baseUserUrl = baseRouteName.baseUserUrl;

router.post(
  `${baseUserUrl}/signup`,
  [
    body("email").isEmail().withMessage("email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 5, max: 12 })
      .withMessage("invalid password"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("email in use");
      throw new BadRequestError("oops, that user already exists!");
    }
    const user = User.build({
      email,
      password,
    });
    await user.save();
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: email,
      },
      process.env.JWT_KEY!
    );
    console.log("this is the user" + user);
    req.session = {
      jwt: userJwt,
    };
    res.status(201).send(user);
  }
);

export { router as signupRouter };
