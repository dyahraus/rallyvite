import { ValidationError } from 'express-validator'; // a type that refers to the type we get back when we do an express validation
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;
 constructor(public errors: ValidationError[]) {
  super('Inavlid request parameters');

  // Only because we are extending a built in class
  Object.setPrototypeOf(this, RequestValidationError.prototype);
 }

 serializeErrors() {
  return this.errors.map((err) => {
    if (err.type === 'field') {
      return { message: err.msg, field: err.path };
    }
    return { message: err.msg };
  });
}
}
