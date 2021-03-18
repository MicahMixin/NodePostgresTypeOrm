import { Sneaker } from "./entity/Sneaker";

export type UserRO = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  sneakers: Sneaker[];
};

export type ApiResponse = {
  success: boolean;
  data: any;
  error: any;
  version: string;
};
