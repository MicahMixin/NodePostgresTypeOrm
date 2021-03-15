import { ApiResponse } from "../types";

const responseHandler = (data: any) => {
  let response: ApiResponse = {
    success: true,
    data,
    error: "",
    version: "1.0.0",
  };

  return response;
};

module.exports = { responseHandler };
