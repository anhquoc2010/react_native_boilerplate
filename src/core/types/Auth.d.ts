declare namespace Auth {
  export type Login = {
    email: string;
    password: string;
  };

  export interface User {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
  }

  export interface Credential {
    expireAt: number;
    token: string;
    user: User;
  }
}
