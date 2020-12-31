import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super("request validation error");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    const formatedErrors = this.errors.map((err) => {
      return {
        message: err.msg,
        field: err.param,
      };
    });
    return formatedErrors;
  }
}
