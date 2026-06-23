export type RegisterDetails = {
  email: string;
  username: string;
};

export type RegisterRequest = RegisterDetails & {
  password: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type CurrentUser = {
  username: string;
};
