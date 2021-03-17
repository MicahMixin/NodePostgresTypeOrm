import { ERROR_CODES } from "../enum";

export const catchError = (target, key, descriptor) => {
  const fn = descriptor.value;
  descriptor.value = async (...args) => {
    try {
      await fn.apply(this, args);
    } catch (error: any) {
      const [, , next] = args;
      next({
        statusCode: error.statusCode ?? ERROR_CODES.HTTP_SERVER_ERROR,
        message: error.message,
      });
    }
  };
};
