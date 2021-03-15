import { ApiResponse } from "../types";

const errorHandler = (status: number, error: string = "") => {
  let response: ApiResponse = {
    success: false,
    data: {},
    error,
    version: "1.0.0",
  };

  if (error == "") {
    switch (status) {
      case 400:
        response.error = "Bad request";
        break;
      case 403:
        response.error = "Not authorized";
        break;
      case 404:
        response.error = "Not found";
        break;
      case 500:
        response.error = "Internal server error";
        break;
    }
  }
  return response;
};

module.exports = { errorHandler };
