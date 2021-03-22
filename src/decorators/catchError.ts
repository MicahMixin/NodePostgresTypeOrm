import { ERROR_CODES } from "../enum";

export const catchError = (target, key, descriptor) => {
  const fn = descriptor.value;
  descriptor.value = async (...args) => {
    try {
      const { statusCode, data } = await fn.apply(this, args);
      const [req, res, next] = args;
      res.statusCode = statusCode;
      res.send(data);
    } catch (error: any) {
      const [req, res, next] = args;
      res.statusCode = error.statusCode ?? ERROR_CODES.HTTP_BAD_REQUEST;
      res.send(error.message);
    }
  };
};
