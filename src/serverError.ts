import { ERROR_CODES, ERROR_MESSAGES } from "./enum";

export class ServerError extends Error {
  statusCode: ERROR_CODES;
  errorMessage: ERROR_MESSAGES | string;

  constructor(statusCode: ERROR_CODES, errorMessage: ERROR_MESSAGES | string) {
    super(errorMessage);
    this.statusCode = statusCode;
    this.errorMessage = errorMessage;
  }
}
