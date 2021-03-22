import { ERROR_CODES } from "../enum";

export interface HttpResponse {
  statusCode: ERROR_CODES;
  data: any;
}
