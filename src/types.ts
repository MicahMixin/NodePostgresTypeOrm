export type UserRO = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export type ApiResponse = {
  success: boolean;
  data: any;
  error: any;
  version: string;
};
