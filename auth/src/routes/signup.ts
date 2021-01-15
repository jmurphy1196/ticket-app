import express, { NextFunction, Request, Response } from "express";
import baseRouteName from "../util/route-config";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { BadRequestError } from "@tkmaster/common";
import { validateRequest } from "@tkmaster/common";
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
    body("confirmPassword").custom(async (confirmPassword, { req }) => {
      const password = req.body.password;
      if (confirmPassword !== password) {
        throw new Error("Passwords must match");
      }
    }),
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
